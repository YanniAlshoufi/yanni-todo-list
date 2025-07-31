"use client";

import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { TodoCard } from "./todo-card";

type Todo = {
  id: number;
  userId: string;
  title: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

export function DoneTodosSection() {
  const { isSignedIn } = useAuth();
  const [isDoneExpanded, setIsDoneExpanded] = useState(false);
  const [doneOffset, setDoneOffset] = useState(0);
  const [loadedDoneTodos, setLoadedDoneTodos] = useState<Todo[]>([]);

  // Fetch done todos
  const { data: doneTodosData, isLoading: doneLoading } =
    api.todos.getDonePaginated.useQuery(
      { limit: 10, offset: doneOffset },
      { enabled: isSignedIn && isDoneExpanded },
    );

  // Prefetch first 10 done todos for better UX
  const apiUtils = api.useUtils();
  useEffect(() => {
    if (isSignedIn) {
      void apiUtils.todos.getDonePaginated.prefetch({ limit: 10, offset: 0 });
    }
  }, [isSignedIn, apiUtils]);

  // Update loaded done todos when new data arrives
  useEffect(() => {
    if (doneTodosData) {
      if (doneOffset === 0) {
        setLoadedDoneTodos(doneTodosData.todos);
      } else {
        setLoadedDoneTodos((prev) => [...prev, ...doneTodosData.todos]);
      }
    }
  }, [doneTodosData, doneOffset]);

  // Effect to refresh done todos when they are expanded to prevent stale data
  useEffect(() => {
    if (isDoneExpanded) {
      // Small delay to let any ongoing mutations complete
      const timer = setTimeout(() => {
        void apiUtils.todos.getDonePaginated.invalidate();
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // Reset done todos state when collapsed
      setDoneOffset(0);
      setLoadedDoneTodos([]);
    }
  }, [isDoneExpanded, apiUtils]);

  const handleLoadMoreDone = () => {
    setDoneOffset((prev) => prev + 10);
  };

  return (
    <Accordion
      title="Done todos"
      isOpen={isDoneExpanded}
      onToggle={() => setIsDoneExpanded(!isDoneExpanded)}
    >
      <ScrollArea className="h-64 w-full">
        <div className="w-full">
          <ul className="flex w-full flex-col gap-3">
            {doneLoading && doneOffset === 0 ? (
              <>
                <li className="w-full">
                  <Skeleton className="h-16 w-full rounded-md" />
                </li>
                <li className="w-full">
                  <Skeleton className="h-16 w-full rounded-md" />
                </li>
              </>
            ) : loadedDoneTodos.length === 0 ? (
              <li className="w-full">
                <Card className="w-full px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No completed todos yet.
                  </p>
                </Card>
              </li>
            ) : (
              <>
                {loadedDoneTodos.map((todo, index) => (
                  <TodoCard
                    todo={todo}
                    key={index}
                    onMarkingUndone={() => {
                      // Remove the todo from the loaded done todos immediately for better UX
                      setLoadedDoneTodos((prev) =>
                        prev.filter((t) => t.id !== todo.id),
                      );
                    }}
                  />
                ))}
                {doneTodosData?.hasMore && (
                  <li className="w-full">
                    <Button
                      onClick={handleLoadMoreDone}
                      disabled={doneLoading}
                      variant="outline"
                      className="w-full"
                    >
                      {doneLoading ? "Loading..." : "Load more"}
                    </Button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </ScrollArea>
    </Accordion>
  );
}

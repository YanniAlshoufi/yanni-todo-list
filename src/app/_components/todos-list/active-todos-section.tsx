"use client";

import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { TodoCard } from "./todo-card";
import { TodosPagination } from "./todos-pagination";

export function ActiveTodosSection() {
  const { isSignedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [animatingTodos, setAnimatingTodos] = useState<Set<number>>(new Set());

  // Reset to page 1 when a new todo is added
  useEffect(() => {
    const handleTodoAdded = () => {
      setCurrentPage(1);
    };

    window.addEventListener("todoAdded", handleTodoAdded);
    return () => window.removeEventListener("todoAdded", handleTodoAdded);
  }, []);

  // Fetch active todos with pagination
  const {
    data: activeTodosData,
    error: activeError,
    isLoading: activeLoading,
  } = api.todos.getActivePaginated.useQuery(
    { page: currentPage, limit: 10 },
    { enabled: isSignedIn },
  );

  // Clear animation state when todos data changes (prevents animation classes on re-added todos)
  useEffect(() => {
    if (activeTodosData) {
      // Clear animation state for any todos that no longer exist in active list or have been marked as done
      setAnimatingTodos((prev) => {
        const newAnimating = new Set<number>();
        prev.forEach((todoId) => {
          const todoStillActive = activeTodosData.todos.find(
            (t) => t.id === todoId && !t.isDone,
          );
          if (todoStillActive) {
            newAnimating.add(todoId);
          }
        });
        return newAnimating;
      });
    }
  }, [activeTodosData]);

  if (!isSignedIn) {
    return (
      <Card className="w-full px-6 py-4 text-center">
        <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
          Please sign in to view todos
        </h2>
      </Card>
    );
  }

  if (activeError) {
    return (
      <Card className="w-full px-6 py-4">
        <h2 className="text-lg font-medium text-red-600 dark:text-red-400">
          Sorry, an error occurred while loading your todos!
        </h2>
      </Card>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Active Todos
      </h3>
      <ScrollArea className="h-96 w-full">
        <div className="w-full">
          <ul className="flex w-full flex-col gap-3">
            {activeLoading || !activeTodosData ? (
              <>
                <li className="w-full">
                  <Skeleton className="h-16 w-full rounded-md" />
                </li>
                <li className="w-full">
                  <Skeleton className="h-16 w-full rounded-md" />
                </li>
                <li className="w-full">
                  <Skeleton className="h-16 w-full rounded-md" />
                </li>
              </>
            ) : activeTodosData.todos.length === 0 ? (
              <li className="w-full">
                <Card className="w-full px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No active todos yet. Add your first todo above!
                  </p>
                </Card>
              </li>
            ) : (
              activeTodosData.todos.map((todo, index) => (
                <TodoCard
                  todo={todo}
                  key={index}
                  onMarkingDone={(todoId: number) => {
                    setAnimatingTodos((prev) => new Set(prev).add(todoId));
                  }}
                  onAnimationComplete={(todoId: number) => {
                    setAnimatingTodos((prev) => {
                      const next = new Set(prev);
                      next.delete(todoId);
                      return next;
                    });
                  }}
                  isAnimating={animatingTodos.has(todo.id)}
                />
              ))
            )}
          </ul>
        </div>
      </ScrollArea>
      {activeTodosData && (
        <TodosPagination
          currentPage={activeTodosData.currentPage}
          totalPages={activeTodosData.totalPages}
          hasPreviousPage={activeTodosData.hasPreviousPage}
          hasNextPage={activeTodosData.hasNextPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

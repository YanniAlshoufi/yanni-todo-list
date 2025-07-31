"use client";

import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export function TodoList() {
  const { error, isLoading, data: todos } = api.todos.getAll.useQuery();

  if (error !== null) {
    return (
      <Card className="w-full px-6 py-4">
        <h2 className="text-lg font-medium text-red-600 dark:text-red-400">
          Sorry, an error occurred while loading your todos!
        </h2>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-96 w-full">
      <div className="w-full">
        <ul className="flex w-full flex-col gap-3">
          {isLoading || todos === undefined ? (
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
          ) : todos.length === 0 ? (
            <li className="w-full">
              <Card className="w-full px-6 py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No todos yet. Add your first todo above!
                </p>
              </Card>
            </li>
          ) : (
            <>
              {todos.map((todo) => (
                <TodoCard todo={todo} key={todo.id} />
              ))}
            </>
          )}
        </ul>
      </div>
    </ScrollArea>
  );
}

function TodoCard(props: {
  todo: {
    id: number;
    userId: string;
    title: string;
    isDone: boolean;
    createdAt: Date;
    updatedAt: Date | null;
  };
}) {
  const apiUtils = api.useUtils();

  const deletionMutation = api.todos.delete.useMutation({
    onMutate: async ({ todoId }) => {
      // Show loading toast
      toast.loading("Deleting todo...");

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await apiUtils.todos.getAll.cancel();

      // Snapshot the previous value
      const previousTodos = apiUtils.todos.getAll.getData();

      // Optimistically update to the new value
      apiUtils.todos.getAll.setData(
        undefined,
        (old) => old?.filter((todo) => todo.id !== todoId) ?? [],
      );

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      apiUtils.todos.getAll.setData(undefined, context?.previousTodos);
      toast.dismiss();
      toast.error("Failed to delete todo. Please try again.");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Todo deleted successfully!");
    },
    onSettled: async () => {
      // Always refetch after error or success
      await apiUtils.todos.getAll.invalidate();
    },
  });

  const toggleMutation = api.todos.toggle.useMutation({
    onMutate: async ({ todoId }) => {
      // Show loading toast
      toast.loading("Updating todo...");

      // Cancel any outgoing refetches
      await apiUtils.todos.getAll.cancel();

      // Snapshot the previous value
      const previousTodos = apiUtils.todos.getAll.getData();

      // Optimistically update to the new value
      apiUtils.todos.getAll.setData(
        undefined,
        (old) =>
          old?.map((todo) =>
            todo.id === todoId ? { ...todo, isDone: !todo.isDone } : todo,
          ) ?? [],
      );

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      apiUtils.todos.getAll.setData(undefined, context?.previousTodos);
      toast.dismiss();
      toast.error("Failed to update todo. Please try again.");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Todo updated successfully!");
    },
    onSettled: async () => {
      // Always refetch after error or success
      await apiUtils.todos.getAll.invalidate();
    },
  });

  const { isSignedIn, userId } = useAuth();

  const handleToggle = () => {
    if (isSignedIn && userId === props.todo.userId) {
      toggleMutation.mutate({ todoId: props.todo.id });
    }
  };

  const handleDelete = () => {
    if (isSignedIn && userId === props.todo.userId) {
      deletionMutation.mutate({ todoId: props.todo.id });
    }
  };

  return (
    <li className="w-full">
      <Card className="w-full px-4 py-3 transition-all duration-150 hover:shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {isSignedIn && userId === props.todo.userId ? (
              <Checkbox
                checked={props.todo.isDone}
                onChange={handleToggle}
                disabled={toggleMutation.isPending}
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center">
                {props.todo.isDone && (
                  <svg
                    className="h-4 w-4 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3
                className={`text-sm font-medium transition-all duration-150 ${
                  props.todo.isDone
                    ? "text-gray-500 line-through dark:text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                } `}
              >
                {props.todo.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Created {props.todo.createdAt.toLocaleDateString()} at{" "}
                {props.todo.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          {isSignedIn && userId === props.todo.userId && (
            <Button
              onClick={handleDelete}
              disabled={deletionMutation.isPending}
              className="h-8 w-8 border-none bg-transparent p-0 text-gray-400 shadow-none transition-all duration-150 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              {deletionMutation.isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </Button>
          )}
        </div>
      </Card>
    </li>
  );
}

"use client";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

type Todo = {
  id: number;
  userId: string;
  title: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date | null;
};

type TodoCardProps = {
  todo: Todo;
  onMarkingDone?: (todoId: number) => void;
  onMarkingUndone?: () => void;
  onAnimationComplete?: (todoId: number) => void;
  isAnimating?: boolean;
};

export function TodoCard(props: TodoCardProps) {
  const apiUtils = api.useUtils();
  const { isSignedIn, userId } = useAuth();
  const { todo, onMarkingDone, onMarkingUndone, isAnimating } = props;

  const deletionMutation = api.todos.delete.useMutation({
    onMutate: async () => {
      // Show loading toast
      toast.loading("Deleting todo...");

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await apiUtils.todos.getActivePaginated.cancel();
      await apiUtils.todos.getDonePaginated.cancel();

      // Snapshot the previous values
      const previousActive = apiUtils.todos.getActivePaginated.getData();
      const previousDone = apiUtils.todos.getDonePaginated.getData();

      // Return a context object with the snapshotted values
      return { previousActive, previousDone };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousActive) {
        apiUtils.todos.getActivePaginated.setData(
          { page: 1, limit: 10 },
          context.previousActive,
        );
      }
      if (context?.previousDone) {
        apiUtils.todos.getDonePaginated.setData(
          { limit: 10, offset: 0 },
          context.previousDone,
        );
      }
      toast.dismiss();
      toast.error("Failed to delete todo. Please try again.");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Todo deleted successfully!");
    },
    onSettled: async () => {
      // Always refetch after error or success
      await apiUtils.todos.getActivePaginated.invalidate();
      await apiUtils.todos.getDonePaginated.invalidate();
    },
  });

  const toggleMutation = api.todos.toggle.useMutation({
    onMutate: async ({ todoId }) => {
      // Show loading toast
      toast.loading("Updating todo...");

      // Cancel any outgoing refetches
      await apiUtils.todos.getActivePaginated.cancel();
      await apiUtils.todos.getDonePaginated.cancel();

      // Return context for rollback
      return { todoId };
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update todo. Please try again.");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Todo updated successfully!");
    },
    onSettled: async () => {
      // Always refetch to get the real state
      await apiUtils.todos.getActivePaginated.invalidate();
      await apiUtils.todos.getDonePaginated.invalidate();
    },
  });

  const handleToggle = () => {
    if (isSignedIn && userId === todo.userId) {
      // If marking as done, trigger animation (only for active todos)
      if (!todo.isDone && onMarkingDone) {
        onMarkingDone(todo.id);
        // Wait for animation to complete before making the mutation
        setTimeout(() => {
          toggleMutation.mutate({ todoId: todo.id });
        }, 500); // Match animation duration
      } else if (todo.isDone && onMarkingUndone) {
        // If marking as undone, immediately remove from done list and reset page
        onMarkingUndone();
        toggleMutation.mutate({ todoId: todo.id });
        // Trigger page reset to show the undone todo on page 1
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("todoAdded"));
        }, 100);
      } else {
        // No animation, just toggle immediately
        toggleMutation.mutate({ todoId: todo.id });
      }
    }
  };

  const handleDelete = () => {
    if (isSignedIn && userId === todo.userId) {
      deletionMutation.mutate({ todoId: todo.id });
    }
  };

  return (
    <li className="w-full">
      <Card
        className={`w-full px-4 py-3 transition-all duration-150 hover:shadow-sm ${
          isAnimating && !todo.isDone
            ? "translate-x-full transform opacity-0 transition-all duration-500 ease-in-out"
            : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div
            className="flex min-w-0 flex-1 cursor-default items-center gap-3"
            onClick={() => {
              if (isSignedIn && userId === todo.userId) {
                handleToggle();
              }
            }}
          >
            {isSignedIn && userId === todo.userId ? (
              <Checkbox
                checked={todo.isDone}
                onChange={() => {
                  // Click is handled by parent div
                }}
                disabled={toggleMutation.isPending}
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center">
                {todo.isDone && (
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
            <div className="min-w-0 flex-1 cursor-default">
              <h3
                className={`cursor-default text-sm font-medium transition-all duration-150 select-none ${
                  todo.isDone
                    ? "text-gray-500 line-through dark:text-gray-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {todo.title}
              </h3>
              <p className="mt-1 cursor-default text-xs text-gray-500 select-none dark:text-gray-400">
                Created {todo.createdAt.toLocaleDateString()} at{" "}
                {todo.createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          {isSignedIn && userId === todo.userId && (
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the card click
                handleDelete();
              }}
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

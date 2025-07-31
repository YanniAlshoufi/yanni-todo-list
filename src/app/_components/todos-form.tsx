"use client";

import { useState } from "react";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { TextInput } from "@/components/ui/text-input";
import { z } from "zod";
import { toast } from "sonner";

export function LatestTodo() {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [isHoveringOverSubmit, setIsHoveringOverSubmit] = useState(false);

  const createTodo = api.todos.create.useMutation({
    onMutate: async ({ title }) => {
      // Show loading toast
      toast.loading("Adding todo...");

      // Cancel any outgoing refetches to prevent race conditions
      await utils.todos.getActivePaginated.cancel();

      // Snapshot the previous value for rollback
      const previousTodos = utils.todos.getActivePaginated.getData({
        page: 1,
        limit: 10,
      });

      // Create optimistic todo
      if (previousTodos) {
        const optimisticId = -(Date.now() + Math.random() * 1000);
        const now = new Date();
        const optimisticTodo = {
          id: optimisticId,
          userId: "optimistic-user", // Will be replaced by server response
          title: title.trim(),
          isDone: false,
          createdAt: now,
          updatedAt: null,
        };

        // Optimistically add the new todo to the first page
        utils.todos.getActivePaginated.setData(
          { page: 1, limit: 10 },
          {
            ...previousTodos,
            todos: [optimisticTodo, ...previousTodos.todos.slice(0, 9)], // Keep only 9 old todos to maintain page size
            totalCount: previousTodos.totalCount + 1,
          },
        );
      }

      return { title, previousTodos };
    },
    onError: (err, variables, context) => {
      // Rollback optimistic update on error
      if (context?.previousTodos) {
        utils.todos.getActivePaginated.setData(
          { page: 1, limit: 10 },
          context.previousTodos,
        );
      }
      toast.dismiss();
      toast.error("Failed to add todo. Please try again.");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Todo added successfully!");
      setName("");

      // Trigger a refresh event that the TodoList can listen to
      window.dispatchEvent(new CustomEvent("todoAdded"));
    },
    onSettled: async () => {
      // Always refetch the active todos after adding a new one to get the real data
      await utils.todos.getActivePaginated.invalidate();
    },
  });

  const nameSchema = z.string().trim().min(1);
  const validationResult = nameSchema.safeParse(name);
  const hasError = validationResult.error !== undefined;

  return (
    <Card className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!hasError && !createTodo.isPending) {
            createTodo.mutate({ title: name.trim() });
          }
        }}
        className="flex flex-col gap-4 px-6 py-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <TextInput
              value={name}
              onChange={setName}
              placeholder="Enter a new todo..."
              error={
                hasError && name.length > 0
                  ? "Please enter a valid todo title"
                  : undefined
              }
              disabled={createTodo.isPending}
            />
          </div>
          <button
            type="submit"
            className={`focus:ring-primary rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-150 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none ${
              hasError || createTodo.isPending
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:opacity-90 active:opacity-80"
            } `}
            disabled={hasError || createTodo.isPending}
            onMouseOver={() => setIsHoveringOverSubmit(true)}
            onMouseLeave={() => setIsHoveringOverSubmit(false)}
          >
            {createTodo.isPending ? (
              <div className="flex items-center gap-2">
                <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                Adding...
              </div>
            ) : (
              "Add Todo"
            )}
          </button>
        </div>
        {isHoveringOverSubmit && (hasError || createTodo.isPending) && (
          <p className="text-muted-foreground text-sm transition-opacity duration-150">
            {createTodo.isPending
              ? "Adding your todo..."
              : "Please enter a todo title to continue."}
          </p>
        )}
      </form>
    </Card>
  );
}

import { LatestTodo } from "@/app/_components/todos-form";
import { HydrateClient } from "@/trpc/server";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { TodoList } from "./_components/todo-list";
import { Card } from "@/components/ui/card";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-100">
              Todo List
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Stay organized and productive with your daily tasks
            </p>
          </div>

          <div className="space-y-6">
            <SignedOut>
              <Card className="px-6 py-4 text-center">
                <h2 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Welcome to your Todo List
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please sign in to start managing your todos and stay
                  organized!
                </p>
              </Card>
            </SignedOut>

            <SignedIn>
              <LatestTodo />
            </SignedIn>

            <TodoList />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}

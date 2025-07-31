import { LatestPost } from "@/app/_components/post-form";
import { HydrateClient } from "@/trpc/server";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { PostList } from "./_components/posts-list";
import { Card } from "@/components/ui/card";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Hello there! :D
        </h1>

        <div className="flex w-150 flex-col gap-10">
          <PostList />

          <SignedOut>
            <Card className="px-5">
              <h2>Please sign in to add a post! :]</h2>
            </Card>
          </SignedOut>
          <SignedIn>
            <LatestPost />
          </SignedIn>
        </div>
      </main>
    </HydrateClient>
  );
}

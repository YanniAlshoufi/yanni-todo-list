"use client";

import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@clerk/nextjs";

export function PostList() {
  const { error, isLoading, data: posts } = api.posts.getAll.useQuery();

  if (error !== null) {
    return <h2>Sorry, an error occured!</h2>;
  }

  return (
    <ScrollArea className="h-100 w-full">
      <div className="w-full">
        <ul className="flex w-full flex-col gap-2">
          {isLoading || posts === undefined ? (
            <>
              <li className="h-21.5 w-full">
                <Skeleton className="bg-card h-full w-full" />
              </li>
              <li className="h-21.5 w-full">
                <Skeleton className="bg-card h-full w-full" />
              </li>
            </>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard post={post} key={post.id} />
              ))}
            </>
          )}
        </ul>
      </div>
    </ScrollArea>
  );
}

function PostCard(props: {
  post: {
    id: number;
    userId: string;
    name: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  };
}) {
  const apiUtils = api.useUtils();
  const deletionMutation = api.posts.delete.useMutation({
    onSuccess: async () => {
      await apiUtils.posts.getAll.invalidate();
    },
  });
  const { isSignedIn, userId } = useAuth();

  return (
    <li className="w-full">
      <Card className="w-full flex-row justify-between px-5">
        {props.post.name} - created {props.post.createdAt.toLocaleString()}
        {isSignedIn && userId === props.post.userId ? (
          <Button
            className="hover:to-card bg-transparent shadow-none hover:bg-radial hover:from-red-950"
            onClick={async () =>
              await deletionMutation.mutateAsync({ postId: props.post.id })
            }
          >
            {deletionMutation.isPending ? (
              <Spinner size="sm" className="bg-black dark:bg-white" />
            ) : (
              <span className="icon-[mingcute--delete-fill] text-gray-200 hover:text-white"></span>
            )}
          </Button>
        ) : (
          <></>
        )}
      </Card>
    </li>
  );
}

import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { posts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        userId: ctx.auth.userId
      });
    }),

  delete: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.delete(posts).where(and(eq(posts.id, input.postId), eq(posts.userId, ctx.auth.userId)));
      if (res.rowsAffected <= 0) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),

  getAll: publicProcedure.query(async ({ctx}) => {
    const posts = await ctx.db.query.posts.findMany({orderBy: (x, {desc}) => desc(x.createdAt)});
    return posts;
  }),
});

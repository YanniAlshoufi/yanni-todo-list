import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { todos } from "@/server/db/schema";
import { and, eq, desc, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const todosRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(todos).values({
        title: input.title,
        isDone: false,
        userId: ctx.auth.userId
      });
    }),

  toggle: protectedProcedure
    .input(z.object({ todoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // First, get the current state
      const currentTodo = await ctx.db.query.todos.findFirst({
        where: and(eq(todos.id, input.todoId), eq(todos.userId, ctx.auth.userId))
      });

      if (!currentTodo) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Then update with the opposite state
      const res = await ctx.db
        .update(todos)
        .set({ isDone: !currentTodo.isDone })
        .where(and(eq(todos.id, input.todoId), eq(todos.userId, ctx.auth.userId)));
      
      if (res.rowsAffected <= 0) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ todoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db.delete(todos).where(and(eq(todos.id, input.todoId), eq(todos.userId, ctx.auth.userId)));
      if (res.rowsAffected <= 0) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),

  // Get paginated todos for the current user (active todos)
  getActivePaginated: protectedProcedure
    .input(z.object({ 
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(50).default(10)
    }))
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;
      
      const [activeTodos, totalCount] = await Promise.all([
        ctx.db.query.todos.findMany({
          where: and(eq(todos.userId, ctx.auth.userId), eq(todos.isDone, false)),
          orderBy: desc(todos.createdAt),
          limit: input.limit,
          offset: offset
        }),
        ctx.db.select({ count: count() }).from(todos)
          .where(and(eq(todos.userId, ctx.auth.userId), eq(todos.isDone, false)))
          .then(res => res[0]?.count ?? 0)
      ]);

      return {
        todos: activeTodos,
        totalCount,
        totalPages: Math.ceil(totalCount / input.limit),
        currentPage: input.page,
        hasNextPage: offset + input.limit < totalCount,
        hasPreviousPage: input.page > 1
      };
    }),

  // Get paginated done todos for the current user
  getDonePaginated: protectedProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ ctx, input }) => {
      const [doneTodos, totalCount] = await Promise.all([
        ctx.db.query.todos.findMany({
          where: and(eq(todos.userId, ctx.auth.userId), eq(todos.isDone, true)),
          orderBy: desc(todos.createdAt),
          limit: input.limit,
          offset: input.offset
        }),
        ctx.db.select({ count: count() }).from(todos)
          .where(and(eq(todos.userId, ctx.auth.userId), eq(todos.isDone, true)))
          .then(res => res[0]?.count ?? 0)
      ]);

      return {
        todos: doneTodos,
        totalCount,
        hasMore: input.offset + input.limit < totalCount
      };
    }),

  // Legacy endpoint - now returns empty array for unauthenticated users
  getAll: publicProcedure.query(async () => {
    // For compatibility, return empty array for unauthenticated users
    return [];
  }),
});

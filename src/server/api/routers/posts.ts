import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { todos } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
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

  getAll: publicProcedure.query(async ({ctx}) => {
    const todos = await ctx.db.query.todos.findMany({orderBy: (x, {desc}) => desc(x.createdAt)});
    return todos;
  }),
});

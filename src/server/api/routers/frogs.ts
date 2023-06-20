import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const frogsRouter = createTRPCRouter({
  hello: publicProcedure
    .meta({ openapi: { method: "GET", path: "/frogs.hello" } })
    .input(z.object({ text: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure
    .meta({ openapi: { method: "GET", path: "/frogs.getall" } })
    .input(z.void())
    .output(
      z
        .object({
          id: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
          name: z.string(),
          age: z.number().nullable(),
        })
        .array()
    )
    .query(async ({ ctx }) => {
      const frogs = await ctx.prisma.frog.findMany();
      return frogs;
    }),
  getAllPrivate: privateProcedure
    .meta({ openapi: { method: "GET", path: "/frogs.getallprivate" } })
    .input(z.void())
    .output(
      z
        .object({
          id: z.string(),
          createdAt: z.date(),
          updatedAt: z.date(),
          name: z.string(),
          age: z.number().nullable(),
        })
        .array()
    )
    .query(async ({ ctx }) => {
      const frogs = await ctx.prisma.frog.findMany();
      return frogs;
    }),
  create: privateProcedure
    .meta({ openapi: { method: "PUT", path: "/frogs.create" } })
    .input(
      z.object({
        name: z.string(),
        age: z.number().nullable(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
        name: z.string(),
        age: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newFrog = await ctx.prisma.frog.create({
        data: {
          name: input.name,
          age: input.age,
        },
      });

      return newFrog;
    }),
});

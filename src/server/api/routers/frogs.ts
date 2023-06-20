import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const frogsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const frogs = await ctx.prisma.frog.findMany();
    return frogs;
  }),
  create: privateProcedure
    .input(
      z.object({
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

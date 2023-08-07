import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";
import { createUserInput, getCurrentUserOutput } from "~/schemas/user-schemas";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { getImagesMeta } from "~/utils/server-helpers";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(6, "1 m"),
  analytics: true,
});

export const userRouter = createTRPCRouter({
  createUser: privateProcedure
    .meta({ openapi: { method: "POST", path: "/user.createUser" } })
    .input(createUserInput)
    .output(getCurrentUserOutput)
    .mutation(async ({ ctx, input }) => {
      const newImage = (await getImagesMeta([input.image || ""]))[0];

      const user = await ctx.prisma.user.create({
        data: {
          username: input.username,
          email: ctx.currentUser.email,
          description: input.description,
          image: {
            create: newImage,
          },
        },
        include: {
          image: true,
        },
      });

      return user;
    }),
  getCurrentUser: privateProcedure
    .meta({ openapi: { method: "POST", path: "/user.getCurrentUser" } })
    .input(
      z.object({
        email: z.string(),
      })
    )
    .output(getCurrentUserOutput.nullable())
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
        include: {
          image: true,
        },
      });

      return user;
    }),
  /** Throws an error if name exists */
  checkIfUsernameExists: privateProcedure
    .meta({
      openapi: { method: "POST", path: "/user.checkIfUsernameExists" },
    })
    .input(z.object({ username: z.string() }))
    .output(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const { success } = await ratelimit.limit(ctx.ip);

      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many requests, please wait before trying again",
        });

      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already exists",
        });

      return true;
    }),
});

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "~/env.mjs";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .meta({ openapi: { method: "POST", path: "/admin.login" } })
    .input(z.object({ password: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      // Rate limit
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
        });

      if (input.password !== env.ADMIN_PASSWORD)
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      return env.ADMIN_TOKEN;
    }),
});

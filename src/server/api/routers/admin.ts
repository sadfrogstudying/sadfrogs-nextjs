import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// TO BE UPDATED: This is totally not secure, but it's just quick implementation for POC
const USER = ["charlie", "insub"];
const PASSWORD =
  "qZuhH8wdm3r3mbCVZuoSY5Iq8+9Tnwthw7yUqQwEU9AUDZRh2vdw9qHM4VloNZBb8Mn+cZEqBlSIggD2ZaWSnxWJUQAooZpZEfjU8QMQaVDrsVNZEgwdTqLbQlH/WJaFjqNXSwkVMuw216XIZJw1rd3xLZgEG0kwwXhlGHJ0bqTuWyVIBMpncsTMhNwnyHy/4pCH3wh0xthaMR54vYs0a/mu4uxF11BGoP9mgA==%";
const LOCAL_TOKEN =
  "MfMIbnUFvj0b4E+tK8TEi5LIU7eXSpV/4V3glScQ/Y5S1HVaJ3dR4XriSRvWH59dybAKMROQ9WdLO0gVJR/s3/fUqzHNzLezcDPUO5/cZeOffb0rJyAy2iXn5NZ4A3nT74OiNNxqDhyBWInrP5y6FV/LsRqdqA5LthcMCywtsp8ogz4vR9y4V2I3duG4H8/4s+JYosWofSt7VH1J1PM7JuP5k4sZMWt9qr3ExQ==%";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .meta({ openapi: { method: "POST", path: "/admin.login" } })
    .input(z.object({ username: z.string(), password: z.string() }))
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      // Rate limit
      const { success } = await ratelimit.limit(ctx.ip);
      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
        });

      if (input.password !== PASSWORD || !USER.includes(input.username))
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });

      return LOCAL_TOKEN;
    }),
});

import { studySpotsRouter } from "~/server/api/routers/studySpots";
import { s3Router } from "~/server/api/routers/s3";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  studySpots: studySpotsRouter,
  s3: s3Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;

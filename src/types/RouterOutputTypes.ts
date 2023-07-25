import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type GetNotValidatedOutput =
  RouterOutput["studySpots"]["getNotValidated"];
export type GetOneOutput = RouterOutput["studySpots"]["getOne"];

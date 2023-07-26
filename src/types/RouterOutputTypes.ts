/**
 * This file will hold the inferred trpc input/output types
 * It will help maintaining decoupling / orthogonality
 * as the child components and the parent components
 * will have a common source of truth for the types
 *
 * E.g. I was having a problem where, adding new fields to
 * the Image model would throw type errors all over the place
 * as I was using the standard Image type in the child components,
 * rather than the inferred image type from outputs
 */

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

type GetNotValidatedOutput = RouterOutput["studySpots"]["getNotValidated"];
type GetOneOutput = RouterOutput["studySpots"]["getOne"];

type ImageOutput = GetNotValidatedOutput[number]["images"][number];

export type {
  // Router Outputs
  GetNotValidatedOutput,
  GetOneOutput,
  // Image Output
  ImageOutput,
};

/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import type { OpenApiMeta } from "trpc-openapi";
import { ZodError } from "zod";
import { prisma } from "~/server/db";
import { type Claims, getSession } from "@auth0/nextjs-auth0";
import { s3 } from "../aws/s3";

import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "~/env.mjs";
import axios, { type AxiosResponse } from "axios";

async function authenticateRequest(token: string) {
  // Load public key from authentication provider
  const jwks = createRemoteJWKSet(
    new URL(`${env.AUTH0_BASE_URL}/.well-known/jwks.json`)
  );
  try {
    // Verify the given token
    const result = await jwtVerify(token.replace("Bearer ", ""), jwks);
    console.log(result);
    return true;
  } catch (e) {
    console.error("Authentication failed: Token could not be verified");
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

interface UserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
}
interface CreateContextOptions {
  currentUser?: Claims | UserInfo;
  ip: string;
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createServerSideHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return { s3, prisma, ...opts };
};

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // ip address
  const header = req.headers["x-forwarded-for"];
  const ip = Array.isArray(header) ? header[0] : req.socket?.remoteAddress;

  let user: Claims | UserInfo | undefined;

  // mobile authentication

  const token = req.headers.authorization;
  if (token) {
    await authenticateRequest(token);
    const { data }: AxiosResponse<UserInfo> = await axios.get(
      `${env.AUTH0_BASE_URL}/userinfo`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    user = data;
  }
  // web authentication
  const session = await getSession(req, res);
  user = session?.user;

  return createInnerTRPCContext({
    currentUser: user,
    ip: ip || "",
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Extending the public procedure with a new "middleware" (not the same as NextJS where it runs on an edge function -
 * just a process that runs before your main request processing - good for attaching auth and ensuring user is
 * authenticated)
 *
 * Since we already attached auth earlier, we can verify here simply
 */
const enforceUserIsAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.currentUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      currentUser: ctx.currentUser,
    },
  });
});

/** When used, will ALWAYS have an authentication object */
export const privateProcedure = t.procedure.use(enforceUserIsAuthed);

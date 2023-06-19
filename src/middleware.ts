/**
 * https://clerk.com/docs/nextjs/middleware
 *
 * Allows us to have authentication when every
 * server request is made by embedding the auth
 * state inside of the request itself.
 *
 * The other request we know if the user’s authed
 * or not based on their cookies, but we don’t know
 * how to process that without doing it on each
 * request.  Instead of doing it manually doing it
 * when req is received, we can do that as part of
 * middleware on an edge before it ever hits our
 * own servers.
 */

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // https://clerk.com/docs/nextjs/middleware#execution-order-of-before-auth-public-routes-and-after-auth
  publicRoutes: [
    "/",
    "/api/frogs.hello",
    "/api/frogs.getall",
    "/api/frogs.create",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

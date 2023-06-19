/**
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

import { withMiddlewareAuthRequired } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match request paths (filter Middleware to run on specific paths)
     * except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     *
     * This includes images, and requests from TRPC.
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
  ],
};

export default withMiddlewareAuthRequired(async function middleware(req) {
  const res = NextResponse.next();
  return res;
});

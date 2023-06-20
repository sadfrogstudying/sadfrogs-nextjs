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
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

export default withMiddlewareAuthRequired(function middleware() {
  const res = NextResponse.next();
  return res;
});

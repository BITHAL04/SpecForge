import { NextResponse } from "next/server";

// Authentication is checked by the client-side AuthGuard. The app supports
// both local API tokens and Clerk sessions, so Clerk middleware cannot be the
// sole gate here (it would reject users signed in through the local API).
export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};

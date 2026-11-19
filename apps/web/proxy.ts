import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

const AUTH_PAGES = ["/sign-in", "/sign-up"]

// Optimistic cookie check only, for fast redirects. Pages still verify the
// session on the server (see Auth.requireSession).
export function proxy(request: NextRequest) {
  const hasSession = Boolean(getSessionCookie(request))
  const isAuthPage = AUTH_PAGES.includes(request.nextUrl.pathname)

  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}

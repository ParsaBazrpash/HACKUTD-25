import { auth } from "@/auth"

export default auth((req) => {
  // Middleware logic can be added here if needed
  // For now, we just want to run the auth check
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - samples (public sample files)
     * - auth (auth pages like signin)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|samples|auth).*)",
  ],
}


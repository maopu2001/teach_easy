import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const authPages = ["/auth/login", "/auth/register", "/auth/reset-password"];
  const protectedRoutes = ["/profile", "/checkout"];

  const isAuthPage = authPages.some((page) => pathname.startsWith(page));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAuthPage && !isProtectedRoute) return NextResponse.next();

  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });
    console.log("Token:", token);
    const isAuthenticated = token?.sub !== undefined;

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isAuthPage) {
      console.log("Redirecting authenticated user away from auth page");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Redirect unauthenticated users from protected routes to login
    if (!isAuthenticated && isProtectedRoute) {
      console.log("Redirecting unauthenticated user to login");
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth check error:", error);
    // On error, allow the request to continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - products (products page)
     * - about (about page)
     * - contact (contact page)
     * - terms (terms and conditions page)
     * - returns (return policy page)
     * - privacy (privacy policy page)
     * - blog (blog page)
     * - shipping (shipping information page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|products|about|contact|terms|returns|privacy|blog|shipping).*)",
  ],
};

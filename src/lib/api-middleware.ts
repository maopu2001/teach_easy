import { NextRequest, NextResponse } from "next/server";
import { auth } from "./next-auth";

interface ApiMiddlewareOptions {
  requireAuth?: boolean;
  requiredRoles?: string[];
  customAuthHandler?: (
    req: NextRequest,
    session: any
  ) => Promise<NextResponse | null>;
}

export async function withApiMiddleware(
  handler: (
    req: NextRequest,
    context?: { params: Record<string, string> }
  ) => Promise<NextResponse>,
  options: ApiMiddlewareOptions = { requireAuth: true }
) {
  return async (
    req: NextRequest,
    context?: { params: Record<string, string> }
  ) => {
    try {
      // Skip auth check if requireAuth is false
      if (options.requireAuth === false) {
        return handler(req, context);
      }

      // Authenticate user
      const session = await auth();

      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check required roles if specified
      if (options.requiredRoles?.length) {
        const userRoles = (session.user as any)?.roles || [];
        const hasRequiredRole = options.requiredRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasRequiredRole) {
          return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 }
          );
        }
      }

      // Run custom auth handler if provided
      if (options.customAuthHandler) {
        const customResponse = await options.customAuthHandler(req, session);
        if (customResponse) {
          return customResponse;
        }
      }

      // Proceed with the actual handler
      return handler(req, context);
    } catch (error) {
      console.error("API middleware error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}

// Shorthand for simple auth-required routes
export function withAuth(
  handler: (
    req: NextRequest,
    context?: { params: Record<string, string> }
  ) => Promise<NextResponse>
) {
  return withApiMiddleware(handler, { requireAuth: true });
}

// Shorthand for admin-only routes
export function withAdminAuth(
  handler: (
    req: NextRequest,
    context?: { params: Record<string, string> }
  ) => Promise<NextResponse>
) {
  return withApiMiddleware(handler, {
    requireAuth: true,
    requiredRoles: ["admin"],
  });
}

// Utility for extracting user ID from session
export function getUserId(req: NextRequest): string | null {
  const session = (req as any).session;
  return session?.user?.id || null;
}

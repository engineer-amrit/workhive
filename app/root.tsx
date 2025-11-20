import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import type { Route } from "./+types/root";
import { CustomMiddleware } from "~/classes/utils/middleware";
import { Auth } from "~/classes/services/auth";
import { UserContext } from "~/middleware/context";
import jwt from "jsonwebtoken";
const { TokenExpiredError } = jwt;
import type { User } from "@prisma/client";
import "./css/app.css";
import WholePageLoader from "./components/ui/WholePageLoader";
import { CustomLoader } from "./classes/utils/loader";


export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


const authMiddleware = CustomMiddleware.withTx(async ({ request, context }, _, tx) => {

  // verify tokens
  const auth = new Auth(tx);
  const { access, refresh } = auth.getCookies(request);
  try {

    const decoded = auth.verifyToken<Omit<User, "password">>(access!);
    context.set(UserContext, decoded);
  } catch (error) {

    if ((!access || error instanceof TokenExpiredError) && refresh) {
      const { access: newAccessToken, refresh: newRefreshToken, decoded } = await auth.refreshTokens(refresh);
      const headers = auth.setCookies(new Headers(), newAccessToken, newRefreshToken);
      context.set(UserContext, {
        ...decoded,
        headers
      });
    }

    else if (!refresh) {

      throw {
        status: 401,
        error: "Authentication required. Please log in.",
      };
    }



    throw error;

  }


});

export const loader = CustomLoader.withoutTx(async ({ context }) => {
  const { headers, ...rest } = context.get(UserContext);
  return Response.json(rest, { headers });
});

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  if (navigation.state === "loading") {
    return <WholePageLoader />
  }

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  console.log(error);

  let message: any = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

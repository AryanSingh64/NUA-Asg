import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { CartProvider } from "../stores/CartContext";
import { Navbar } from "../components/Navbar/Navbar";
import { CartDrawer } from "../components/CartDrawer/CartDrawer";

function NotFoundComponent() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "var(--bg)",
        color: "var(--fg)",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <p
          style={{
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontSize: "0.75rem",
            color: "var(--fg-muted)",
            marginBottom: "1rem",
          }}
        >
          Not found
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "3rem",
            margin: "0 0 1rem",
          }}
        >
          This page has wandered off.
        </h1>
        <p style={{ color: "var(--fg-muted)", marginBottom: "2rem" }}>
          The link is broken or the piece has been retired.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.85rem 1.6rem",
            background: "var(--moss-800)",
            color: "var(--cream-50)",
            borderRadius: "999px",
            fontSize: "0.8rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "var(--bg)",
        color: "var(--fg)",
      }}
    >
      <div style={{ maxWidth: 460, textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>
          Something didn't load
        </h1>
        <p style={{ color: "var(--fg-muted)", margin: "1rem 0 2rem" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          style={{
            padding: "0.85rem 1.6rem",
            background: "var(--moss-800)",
            color: "var(--cream-50)",
            border: 0,
            borderRadius: "999px",
            fontSize: "0.8rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "nua - considered clothing" },
        {
          name: "description",
          content:
            "A mini e-commerce experience where nature-inspired design meets sustainable style. Browse the seasonal edit and add pieces to your bag.",
        },
        { name: "author", content: "nua Studio" },
        { property: "og:title", content: "nua - considered clothing" },
        {
          property: "og:description",
          content:
            "Browse the nature-inspired seasonal edit: women's, men's, jewellery and everyday objects.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap",
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <Navbar />
        <Outlet />
        <CartDrawer />
      </CartProvider>
    </QueryClientProvider>
  );
}

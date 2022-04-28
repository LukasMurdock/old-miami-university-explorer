import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import tufteStylesheetUrl from "./styles/tufte.css";
import { getUser } from "./session.server";

export const links: LinksFunction = () => {
  return [
    // { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: tufteStylesheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Miami University Explorer",
  description:
    "Easily explore and find classes and buildings at Miami University.",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

function Navigation() {
  return (
    <nav>
      <p>
        <Link to="/">Home</Link>
      </p>
      <p>
        <Link to="/courses">Subjects</Link>
        {" — "}
        <Link to="/courses/random">Random</Link>
      </p>
      <p>
        <Link to="/buildings">Buildings</Link>
      </p>
    </nav>
  );
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Navigation />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

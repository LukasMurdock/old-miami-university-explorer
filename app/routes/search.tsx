import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useFetcher } from "@remix-run/react";
import { FormEvent, useEffect, useRef } from "react";
import styles from "~/styles/search.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const search = body.get("search");
  console.log("RECIEVED");

  return json(search);
};

export function SearchInput() {
  const search = useFetcher();
  const ref = useRef();

  function handleChange(e: FormEvent<HTMLFormElement>) {
    const searchInput = e.target as HTMLInputElement;

    search.submit(
      { search: searchInput.value },
      { method: "post", action: "/search" }
    );
  }

  // types of results
  //    1. subject (CSE) (C)
  //    2. code (252) (2)
  //    3.

  return (
    <div>
      <search.Form method="post" action="/search" onChange={handleChange}>
        <input type="text" id="search" name="search" />
      </search.Form>
      <span>{search.data}</span>
    </div>
  );
}

export default function SearchPage() {
  return (
    <article>
      {/* <h1>Miami University Explorer</h1>
      <p className="subtitle">
        Reference to Miami University courses and buildings
      </p> */}
      <section>
        {/* <p> */}
        <SearchInput />
        {/* </p> */}
      </section>
    </article>
  );
}

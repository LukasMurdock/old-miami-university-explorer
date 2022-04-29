import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ApiTerm } from "prisma/ws.miamioh.edu";
import invariant from "tiny-invariant";
import { seedCoursesFromTerm } from "~/models/course.server";
import { loadTermsFromApi } from "~/models/term.server";

type LoaderData = {
  terms: ApiTerm[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const terms = await loadTermsFromApi();
  return json<LoaderData>({ terms: terms });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = formData.get("id");
  invariant(id, "No id passed");
  await seedCoursesFromTerm(id as string);
  return json({ id: id });
};

export default function Terms() {
  const { terms } = useLoaderData<LoaderData>();
  const actionData = useActionData();
  console.log(actionData);

  return (
    <section>
      <h1>Terms</h1>
      <ul>
        {terms.map((term) => (
          <li key={term.termId}>
            <Form method="post">
              <span>
                {term.termId} - {term.name}
              </span>{" "}
              <input id="id" name="id" type="hidden" value={term.termId} />
              <button type="submit">Load</button>
            </Form>
          </li>
        ))}
      </ul>
    </section>
  );
}

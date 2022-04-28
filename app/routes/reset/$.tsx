import { useLoaderData, useParams } from "@remix-run/react";
import { LoaderFunction, ActionFunction, json } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ params }) => {
  //   return params["*"];
  invariant(params["*"], "params not found");
  const [subject, code, section] = params["*"].split("/");
  return json({ subject, code, section });
};

export default function CourseQueryPage() {
  const data = useLoaderData();
  console.log(data);

  return (
    <div>
      <div className="prose">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

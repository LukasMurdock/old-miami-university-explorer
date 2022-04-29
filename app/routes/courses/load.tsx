import { CourseInstance } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { loadTermsFromApi } from "~/models/term.server";

// type LoaderData = {
//   courseInstances: CourseInstance[];
// };

export const loader: LoaderFunction = async ({ request, params }) => {
  //   await loadBuildingsFromApi();
  const currentTerm = await loadTermsFromApi();
  console.log(currentTerm);
  return json({ currentTerm: currentTerm });
};

export default function Load() {
  return (
    <div>
      <h1>Loaded from API</h1>
    </div>
  );
}

import { Building } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { loadBuildingsFromApi } from "~/models/building.server";

type LoaderData = {
  buildings: Building[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await loadBuildingsFromApi();
  return json<LoaderData>({ buildings: [] });
};

export default function Load() {
  return (
    <div>
      <h1>Loaded from API</h1>
    </div>
  );
}

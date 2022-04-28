import { Building } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getBuildings, getBuildingsSorted } from "~/models/building.server";

type LoaderData = {
  buildings: Building[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const buildings = await getBuildingsSorted();
  return json<LoaderData>({ buildings: buildings });

  //   return json<LoaderData>({ buildings: [] });
};

export default function Buildings() {
  const { buildings } = useLoaderData<LoaderData>();
  console.log(buildings);
  return (
    <section>
      <h1>Buildings</h1>
      <ul>
        {buildings.map((building) => (
          <li key={building.code}>
            <Link to={`/buildings/${building.code}`}>
              {building.code} — {building.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { Building } from "@prisma/client";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getBuilding } from "~/models/building.server";

type LoaderData = {
  building: Building;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.buildingCode, "params not found");
  const building = await getBuilding(params.buildingCode);
  console.log(building);
  if (!building) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ building: building });

  //   return json<LoaderData>({ buildings: [] });
};

export default function BuildingCode() {
  const { building } = useLoaderData<LoaderData>();

  return (
    <section>
      <h1>
        {building.code} — {building.name}
      </h1>
      <p>{building.address}</p>
      <p>Campus: {building.campusCode}</p>
      <p>Lat: {building.latitude}</p>
      <p>Lon: {building.longitute}</p>
      <p>Wifi: {building.wifi ? "Yes" : "No"}</p>
      <a
        href={`https://maps.google.com/maps?q=${building.latitude},${building.longitute}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get directions
      </a>
      {building.imageURL && (
        <figure>
          {/* <label htmlFor="mn-exports-imports" className="margin-toggle">&#8853;</label><input type="checkbox" id="mn-exports-imports" className="margin-toggle"/><span className="marginnote">From Edward Tufte, <em>Visual Display of Quantitative Information</em>, page 92.</span> */}
          <img src={building.imageURL} alt={building.name} loading="lazy" />
        </figure>
      )}
    </section>
  );
}

export function CatchBoundary() {
  const params = useParams();
  return (
    <section>
      <h2>We couldn't find that building!</h2>
      <p>You searched for building “{params.buildingCode}”</p>
    </section>
  );
}

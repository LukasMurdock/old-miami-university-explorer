import { Building } from "@prisma/client";
import { prisma } from "~/db.server";

type ApiBuilding = {
  buildingCode: string;
  buildingName: string;
  buildingAddress?: string;
  buildingCity?: string;
  buildingZip: string;
  buildingState?: string;
  campusCode: string;
  latitude: string;
  longitude: string;
  imageURL?: string;
  wifi: string;
  functionCode: string;
};

export async function getBuilding(buildingSearch: string) {
  const buildingCodeLength = 3;

  if (buildingSearch.length === buildingCodeLength) {
    return await prisma.building.findFirst({
      where: {
        code: buildingSearch,
      },
    });
  } else {
    return await prisma.building.findFirst({
      where: {
        name: buildingSearch,
      },
    });
  }
}

export async function getBuildingsSorted() {
  return await prisma.building.findMany({
    orderBy: {
      code: "asc",
    },
  });
}

export async function getBuildings() {
  return await prisma.building.findMany();
}

async function getBuildingsFromApi() {
  const buildingEndpoint = "https://ws.miamioh.edu/api/building/v1";
  const buildingResponse = await fetch(buildingEndpoint);
  const { data } = await buildingResponse.json();
  return data as ApiBuilding[];
}

async function deleteAllBuildings() {
  const existingBuildings = await prisma.building.findMany();
  for (const building of existingBuildings) {
    await prisma.building.delete({ where: { code: building.code } });
  }
}

export async function loadBuildingsFromApi() {
  // cleanup the existing database
  await deleteAllBuildings();

  const buildings = await getBuildingsFromApi();
  buildings.map(addBuilding);

  //   console.log(buildings[0]);
  //   await addBuilding(buildings[0]);
}

export async function addBuilding(add: ApiBuilding) {
  //   let imageBlob = Buffer.from(new ArrayBuffer(8));
  //   let imageBlob = null;
  //   if (add.imageURL) {
  //     const imageResponse = await fetch(add.imageURL);
  //     const buffer = await imageResponse.arrayBuffer();
  //     imageBlob = Buffer.from(buffer);
  //   }

  //   console.log(imageBlob);

  await prisma.building.upsert({
    where: {
      code: add.buildingCode,
    },
    update: {},
    create: {
      code: add.buildingCode,
      name: add.buildingName,
      address: add.buildingAddress ?? "",
      city: add.buildingCity ?? "",
      zip: add.buildingZip ?? "",
      state: add.buildingState ?? "",
      campusCode: add.campusCode ?? "",
      latitude: add.latitude ?? "",
      longitute: add.longitude ?? "",
      imageURL: add.imageURL ?? "",
      //   imageBlob: imageBlob,
      wifi: add.wifi.toUpperCase() === "Y",
      functionCode: add.functionCode ?? "",
    },
  });

  //   await prisma.building.create({
  //     data: {
  // code: add.buildingCode,
  // name: add.buildingName,
  // address: add.buildingAddress ?? "",
  // city: add.buildingCity ?? "",
  // zip: add.buildingZip ?? "",
  // state: add.buildingState ?? "",
  // campusCode: add.campusCode ?? "",
  // latitude: add.latitude ?? "",
  // longitute: add.longitude ?? "",
  // imageURL: add.imageURL ?? "",
  // imageBlob: imageBlob,
  // wifi: add.wifi.toUpperCase() === "Y",
  // functionCode: add.functionCode ?? "",
  //     },
  //   });
}

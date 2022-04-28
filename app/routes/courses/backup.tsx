import { CourseInstance } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCourseInstance } from "~/models/course.server";

import type { Note } from "~/models/note.server";
import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  courseInstance: CourseInstance;
  params: any;
};

// 20180
export const loader: LoaderFunction = async ({ request, params }) => {
  //   const userId = await requireUserId(request);
  // invariant(params.searchQuery, "searchQuery not found");

  const subjectCodeLength = 3;

  //   const searchType =
  //     params.searchQuery.length <= 3
  //       ? isNaN(Number(params.searchQuery))
  //         ? "subject"
  //         : "code"
  //       : isNaN(Number(params.searchQuery))
  //       ? "subject-code"
  //       : "crn";

  //   let courseInstance = null;
  //   const courseInstance = await getCourseInstance({ id: "20180" });
  const courseInstance = await prisma.courseInstance.findFirst({
    where: { id: "20180" },
  });

  //   const courseInstance = await prisma.courseInstance.findFirst({
  //     where: { subject: "AES", code: "111" },
  //   });
  //   switch (searchType) {
  //     case "crn":
  //       courseInstance = await prisma.courseInstance.findFirst({
  //         where: { id: params.searchQuery },
  //       });
  //       break;
  //     case "subject":
  //       courseInstance = await prisma.courseInstance.findFirst({
  //         where: { subject: params.searchQuery },
  //       });
  //       break;
  //     case "subject-code":
  //       const [subject, code] = [
  //         params.searchQuery.slice(0, 3),
  //         params.searchQuery.slice(3),
  //       ];
  //       courseInstance = await prisma.courseInstance.findFirst({
  //         where: { subject, code },
  //       });
  //       break;
  //   }

  // valid searches
  // 20180  CRN
  // CSE    subject
  // CSE252 subject-code
  // CSE252L-A subject-code-section

  // 20180  CRN
  // cse/252L/A

  //   const courseInstance = await getCourseInstance({ id: params.searchQuery });
  if (!courseInstance) {
    throw new Response("Not Found", { status: 404 });
  }
  //   return json<LoaderData>({ params: params.searchQuery, courseInstance });
  return json<LoaderData>({ params: params["*"], courseInstance });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

export default function CourseQueryPage() {
  const data = useLoaderData() as LoaderData;
  console.log(data);

  return (
    <div>
      <h3 className="text-2xl font-bold">{`${data.courseInstance.subject} ${data.courseInstance.code}`}</h3>
      <p className="py-6">{data.courseInstance.description}</p>
      <hr className="my-4" />
      {/* <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form> */}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Course not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

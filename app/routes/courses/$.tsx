import { CourseInstance } from "@prisma/client";
import { prisma } from "~/db.server";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  getCourseInstances,
  GroupedCourse,
  groupInstancesByCourseAndTerm,
} from "~/models/course.server";

import type { Note } from "~/models/note.server";
import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { CourseSectionsList, formatTermId } from "./$subjectCode";

type LoaderData = {
  courseInstances: CourseInstance[];
  groupedCourses: GroupedCourse[];
  params: any;
  subject: string;
  code: string;
  section?: string;
};

// 20180
export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params["*"], "params not found");

  //   const courseInstance = await prisma.courseInstance.findFirst({
  //     where: { id: "20180" },
  //   });

  //   const courseInstance = await prisma.courseInstance.findFirst({
  //     where: { subject: "AES", code: "111" },
  //   });

  let courseInstances = null;
  //   courseInstance = await prisma.courseInstance.findFirst({
  //     where: { id: params["*"] },
  //   });

  const [subject, code, section] = params["*"].split("/");
  //   if (subject.length < 6) {
  //   courseInstances = await getCourseInstances({ subject, code, section });
  //   } else {
  //     courseInstances = await getCourseInstances({ id: subject });
  //   }
  courseInstances = await prisma.courseInstance.findMany({
    where: {
      subject: subject.toUpperCase(),
      ...(code && { code }),
      ...(section && { section }),
    },
  });
  //   if (params["*"].split("/").length > 1) {
  //     const [subject, code, section] = params["*"].split("/");
  //     courseInstances = await prisma.courseInstance.findMany({
  //       where: {
  //         subject: subject.toUpperCase(),
  //         ...(code && { code }),
  //         ...(section && { section }),
  //       },
  //     });
  //   } else {
  //     courseInstances = await prisma.courseInstance.findMany({
  //       where: { id: params["*"] },
  //     });
  //   }

  // 20180  CRN
  // cse/252L/A

  // subject page (summarize sections)
  // subject-code page (show section deets)
  // subject-code-section page (show all instance deets)

  if (!courseInstances) {
    throw new Response("Not Found", { status: 404 });
  }

  const groupedCourses = groupInstancesByCourseAndTerm(courseInstances);

  //   return json<LoaderData>({ params: params.searchQuery, courseInstance });
  return json<LoaderData>({
    params: params["*"],
    courseInstances,
    groupedCourses,
    subject: subject.toUpperCase(),
    code,
    section,
  });
};

export default function CourseQueryPage() {
  const data = useLoaderData() as LoaderData;
  console.log(data);
  const [subject, code, section] = data.params.split("/");
  console.log(subject, code, section);

  // subject-code page (show section deets)
  // subject-code-section page (show all instance deets)
  if (data.section) {
    return <SubjectCodeSection data={data} />;
  } else {
    return <SubjectCode data={data} />;
  }
}

function SubjectCode({ data }: { data: LoaderData }) {
  return (
    <article>
      {/* <h1>
        {data.subject} {data.code}
      </h1> */}
      <h1>
        {data.groupedCourses[0].course} — {data.groupedCourses[0].title}
      </h1>
      <section>
        <p>{data.groupedCourses[0].description}</p>
        <h2>Sections</h2>
        {data.groupedCourses[0].terms.map((term) => (
          <section key={term.term}>
            <p>
              {formatTermId(term.term)}
              <label htmlFor={`${term.term}id`} className="margin-toggle">
                &#8853;
              </label>
              <input
                type="checkbox"
                id={`${term.term}id`}
                className="margin-toggle"
              />
              <span className="marginnote">{term.term}</span>
            </p>
            <CourseSectionsList sections={term.sections} />
          </section>
        ))}
      </section>
    </article>
  );
}

function SubjectCodeSection({ data }: { data: LoaderData }) {
  return (
    <article>
      <h1>
        {data.groupedCourses[0].course} — {data.groupedCourses[0].title}
      </h1>
      <section>
        <p>{data.groupedCourses[0].description}</p>
        <h2>Sections</h2>
        {data.groupedCourses[0].terms.map((term) => (
          <section key={term.term}>
            <p>
              {formatTermId(term.term)}
              <label htmlFor={`${term.term}id`} className="margin-toggle">
                &#8853;
              </label>
              <input
                type="checkbox"
                id={`${term.term}id`}
                className="margin-toggle"
              />
              <span className="marginnote">{term.term}</span>
            </p>
            <CourseSectionsList sections={term.sections} />
          </section>
        ))}
      </section>
    </article>
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

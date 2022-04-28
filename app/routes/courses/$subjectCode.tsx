import type { CourseInstance } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Params } from "react-router";
import invariant from "tiny-invariant";
import {
  getCourseInstances,
  GroupedCourse,
  groupInstancesByCourseAndTerm,
} from "~/models/course.server";

const seasonCodes = [
  { name: "fall", code: 10 },
  { name: "winter", code: 15 },
  { name: "spring", code: 20 },
  { name: "summer", code: 30 },
];

export function formatTermId(termId: string) {
  const [year, seasonCode] = [termId.substring(0, 4), termId.substring(4)];
  const season = seasonCodes.find(
    (season) => season.code === Number(seasonCode)
  );
  return `${year} ${season?.name}`;
}

type LoaderData = {
  courseInstances: CourseInstance[];
  courses: GroupedCourse[];
  //   courses: {
  //     course: string;
  //     sections: CourseInstance[];
  //   }[];
};

export const meta: MetaFunction = ({
  data,
  params,
}: {
  data: LoaderData;
  params: Params<string>;
}) => ({
  title: `${params.subjectCode} | Miami University Explorer`,
  description: `See ${params.subjectCode} courses at Miami University.`,
});

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.subjectCode, "params not found");

  //If id is searched, redirect to, e.g., /courses/aaa/201
  if (!isNaN(Number(params.subjectCode))) {
    const courseInstances = await getCourseInstances({
      id: params.subjectCode,
    });
    return redirect(
      `/courses/${courseInstances[0].subject}/${courseInstances[0].code}`
    );
  }

  const courseInstances = await getCourseInstances({
    subject: params.subjectCode,
  });

  if (!courseInstances) {
    throw new Response("Not Found", { status: 404 });
  }

  const groupedCourses = groupInstancesByCourseAndTerm(courseInstances);

  return json<LoaderData>({ courses: groupedCourses, courseInstances });
};

export default function SubjectCodePage() {
  const { courseInstances, courses } = useLoaderData() as LoaderData;
  console.log(courseInstances);
  console.log(courses);

  return (
    <article>
      <h1>{courseInstances[0].subject}</h1>
      <section>
        {courses.map((courseData) => (
          <section key={courseData.course}>
            <h2>
              <Link to={`/courses/${courseData.course.replace(" ", "/")}`}>
                {courseData.course} — {courseData.title}
              </Link>
            </h2>
            <p>{courseData.description}</p>
            {/* <pre>{JSON.stringify(courseData.terms, null, 2)}</pre> */}
            {/* {courseData.terms.map((term) => (
              <section key={courseData.course + term.term}>
                <p>
                  {formatTermId(term.term)}
                  <label
                    htmlFor={`${courseData.course + term.term}id`}
                    className="margin-toggle"
                  >
                    &#8853;
                  </label>
                  <input
                    type="checkbox"
                    id={`${courseData.course + term.term}id`}
                    className="margin-toggle"
                  />
                  <span className="marginnote">{term.term}</span>
                </p>
                <CourseSectionsList sections={term.sections} />
              </section>
            ))} */}
            {/* {courseData.terms.map((term) => (
              <section key={courseData.course + term}>
                <h3>{courseData.course}</h3>
                <p>{courseData.sections[0].description}</p>
                <h3>Sections</h3>
                <CourseSectionsList sections={terms.sections} />
              </section>
            ))} */}
          </section>
        ))}
      </section>
    </article>
  );
}

export function CourseSectionsList({
  sections,
}: {
  sections: CourseInstance[];
}) {
  return (
    <ul>
      {sections.map((section) => (
        <li key={section.id}>
          <p>
            {section.subject} {section.code} {section.section}
            <label
              htmlFor={
                section.term + section.subject + section.code + section.section
              }
              className="margin-toggle"
            >
              &#8853;
            </label>
            <input
              type="checkbox"
              id={
                section.term + section.subject + section.code + section.section
              }
              className="margin-toggle"
            />
            <span className="marginnote">
              CRN: {section.id}, Seats: {section.enrollmentMax}, Credits:{" "}
              {section.credits}, Instruction: {section.instructionType}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { CourseInstance, getUniqueSubjects } from "~/models/course.server";

type LoaderData = {
  uniqueSubjects: CourseInstance[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const uniqueSubjects = await getUniqueSubjects();
  return json<LoaderData>({ uniqueSubjects: uniqueSubjects });
};

export default function Courses() {
  const { uniqueSubjects } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Subjects</h1>
      <ul>
        {uniqueSubjects.map((subject) => (
          <li key={subject.subject}>
            <Link to={`/courses/${subject.subject}`}>{subject.subject}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

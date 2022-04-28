import { LoaderFunction, json, redirect } from "@remix-run/node";
import {
  getCourseInstances,
  getRandomCourse,
  GroupedCourse,
} from "~/models/course.server";

type LoaderData = {
  groupedCourses: GroupedCourse[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const randomCourse = await getRandomCourse();
  if (!randomCourse) {
    throw new Response("Not Found", { status: 404 });
  }

  //   const courseInstances = await getCourseInstances({ id: randomCourse.id });

  //   console.log(randomCourse);

  return redirect(`/courses/${randomCourse.subject}/${randomCourse.code}`);

  //   return json<LoaderData>({ groupedCourses: [courseInstances] });
};

export default function Random() {
  return (
    <section>
      <h1>Random</h1>
      <p>Random : getRandomCourse</p>
    </section>
  );
}

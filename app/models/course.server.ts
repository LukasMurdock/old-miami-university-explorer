import { CourseInstance } from "@prisma/client";
import { prisma } from "~/db.server";
export type { CourseInstance } from "@prisma/client";

export type GroupedCourse = {
  course: string; // CSE 252
  title: string;
  description: string;
  terms: {
    term: string;
    sections: CourseInstance[];
  }[];
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function getUniqueSubjects() {
  const uniqueSubjects = await prisma.courseInstance.findMany({
    distinct: ["subject"],
  });
  return uniqueSubjects;
}

export async function getRandomCourse() {
  // Prisma does not support random query
  // https://github.com/prisma/prisma/discussions/5886
  const randomCourseInstanceQuery = await prisma.$queryRaw<
    CourseInstance[]
  >`SELECT * FROM CourseInstance ORDER BY RANDOM() LIMIT 1;`;
  const randomCourseInstance = randomCourseInstanceQuery[0];
  return randomCourseInstance;
}

export function groupInstancesByCourseAndTerm(
  courses: CourseInstance[]
): GroupedCourse[] {
  const groupedCourses = courses.reduce(function (r, a) {
    const key = `${a.subject} ${a.code}`;
    r[key] = r[key] || [];
    r[key].push(a);
    return r;
  }, {} as { [key: string]: CourseInstance[] });

  const arrayOfCourses = Object.entries(groupedCourses).map((course) => ({
    course: course[0],
    sections: course[1],
  }));

  const finalArray = arrayOfCourses.map((courseData) => {
    const groupedByTerms = courses.reduce(function (r, a) {
      const key = `${a.term}`;
      r[key] = r[key] || [];
      r[key].push(a);
      return r;
    }, {} as { [key: string]: CourseInstance[] });

    const arrayOfTerms = Object.entries(groupedByTerms).map((termData) => ({
      term: termData[0],
      sections: termData[1],
    }));

    return {
      course: `${courseData.sections[0].subject} ${courseData.sections[0].code}`,
      title: courseData.sections[0].title,
      description: courseData.sections[0].description,
      terms: arrayOfTerms,
    };
  });

  return finalArray;
}

export function getCourseInstances({
  id,
  subject,
  code,
  section,
}: {
  id?: string;
  subject?: string;
  code?: string;
  section?: string;
}) {
  //   return prisma.courseInstance.findFirst({
  //     where: { id },
  //   });
  return prisma.courseInstance.findMany({
    where: {
      ...(id && { id }),
      ...(subject && { subject: subject.toUpperCase() }),
      ...(code && { code }),
      ...(section && { section }),
    },
  });
}

export function CourseInstanceCount() {
  return prisma.courseInstance.count();
}

export function getCourse({
  subject,
  code,
}: {
  subject: string;
  code: string;
}) {
  return prisma.courseInstance.findMany({
    where: { subject, code },
  });
}

// Holding

// const groupedByTerms = courseInstances.reduce(function (r, a) {
//     const key = `${a.term}`;
//     r[key] = r[key] || [];
//     r[key].push(a);
//     return r;
//   }, {} as { [key: string]: CourseInstance[] });

//   const arrayOfTerms = Object.entries(groupedByTerms).map((termData) => ({
//     term: termData[0],
//     courses: termData[1],
//   }));

//   const finalArray = arrayOfTerms.map((termData) => {
//     const groupedCourses = termData.courses.reduce(function (r, a) {
//       const key = `${a.subject} ${a.code}`;
//       r[key] = r[key] || [];
//       r[key].push(a);
//       return r;
//     }, {} as { [key: string]: CourseInstance[] });

//     const groupedCoursesArray = Object.entries(groupedCourses).map(
//       (course) => ({
//         course: course[0],
//         sections: course[1],
//       })
//     );

//     return { term: termData.term, courses: groupedCoursesArray };
//   });

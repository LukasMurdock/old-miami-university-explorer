import { PrismaClient } from "@prisma/client";
import { ApiCourseSection, ApiTerm } from "./ws.miamioh.edu";
import { subjects } from "./subjects";
import axios from "axios";

const prisma = new PrismaClient();

async function fetchSubjectSections({
  campusCode,
  termId,
  subjectCode,
  limit,
}: {
  campusCode: string;
  termId: string;
  subjectCode: string;
  limit?: number;
}) {
  const subjectCodeEndpoint = `http://ws.miamioh.edu/courseSectionV2/${termId}.json?campusCode=${campusCode}&courseSubjectCode=${subjectCode}${
    limit ? `&limit=${limit}` : ""
  }`;

  // No fetch
  //   const response = await fetch(subjectCodeEndpoint);
  //   const { courseSections }: { courseSections: ApiCourseSection[] } =
  //   await response.json();
  //   return courseSections;

  const response = await axios.get<{ courseSections: ApiCourseSection[] }>(
    subjectCodeEndpoint
  );
  return response.data.courseSections;

  //   if (!courseSections) {
  //     throw "ws.miamioh.edu/courseSectionV2 returned no courseSections";
  //   }
}

export async function seedCourses() {
  // fetch all years, (start by just fetching current year)
  // fetching current term

  // No fetch
  const allTermsEndpoint =
    "https://ws.miamioh.edu/api/academic/banner/v2/academicTerms";
  const allTerms = (await axios.get(allTermsEndpoint)).data.data;

  const currentTermEndpoint =
    "http://ws.miamioh.edu/api/academic/banner/v2/academicTerms/current";
  // const currentTermResponse = await fetch(currentTermEndpoint);
  // const { data } = await currentTermResponse.json();
  // const termId = data.termId;
  const currentTerm: ApiTerm = (await axios.get(currentTermEndpoint)).data.data;

  // TODO: test in deno, fetch all terms, fetch current term, filter for termIds equal to, or greater than, current term

  const currentTermAndUp: ApiTerm[] = allTerms.filter(
    (term: ApiTerm) =>
      Number(term.termId) >= Number(currentTerm.termId) &&
      Number(term.termId) <= Number(currentTerm.termId) + 100
  );
  //   const response = await axios.get(currentTermEndpoint);
  //   console.log(response.data);
  // const termId = response.data.data.termId;

  //   const termId = currentTerm;

  //   console.log(data);

  //   if (!data) {
  //     throw "ws.miamioh.edu/api did not return a term";
  //   }

  //   const termId = "202220";
  console.log(
    `Will fetch: ${currentTermAndUp.map((term) => term.termId).join(",")}`
  );
  //   console.log(currentTermAndUp);

  // loop currentTermAndUp
  // loop subjects for courseInstances
  // loop courseInstances and add to database
  for (const term of currentTermAndUp) {
    console.log(`Fetching: ${term.termId}`);
    const termId = term.termId;

    for (const subjectCode of subjects) {
      const courseSections = await fetchSubjectSections({
        termId,
        campusCode: "O",
        subjectCode,
        limit: 2,
      });

      for (const section of courseSections) {
        console.log(section.courseSubjectCode + " " + section.courseNumber);

        await prisma.courseInstance.upsert({
          where: {
            id: section.courseId, // 22472
          },
          update: {},
          create: {
            id: section.courseId, // 22472
            campus: section.campusCode, // O
            subject: section.courseSubjectCode, // CSE
            code: section.courseNumber, // 252, 111L Not a Number
            term: section.academicTerm, // 202220
            title: section.courseTitle ?? "", // Web Application Programming
            section: section.courseSectionCode, // A
            description: section.courseDescription ?? "", // words
            instructionType: section.instructionalTypeDescription, // Lecture
            credits: Number(section.creditHoursHigh), // 3
            enrollmentMax: Number(section.enrollmentCountMax), // 150
          },
        });

        // await prisma.courseInstance.create({
        //   data: {
        //     id: section.courseId, // 22472
        //     campus: section.campusCode, // O
        //     subject: section.courseSubjectCode, // CSE
        //     code: section.courseNumber, // 252, 111L Not a Number
        //     term: section.academicTerm, // 202220
        //     title: section.courseTitle ?? "", // Web Application Programming
        //     section: section.courseSectionCode, // A
        //     description: section.courseDescription ?? "", // words
        //     instructionType: section.instructionalTypeDescription, // Lecture
        //     credits: Number(section.creditHoursHigh), // 3
        //     enrollmentMax: Number(section.enrollmentCountMax), // 150
        //   },
        // });
      }
    }
  }
}

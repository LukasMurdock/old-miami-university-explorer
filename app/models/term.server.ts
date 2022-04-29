import { ApiTerm } from "prisma/ws.miamioh.edu";

export async function getCurrentTermFromApi() {
  const currentTermEndpoint =
    "http://ws.miamioh.edu/api/academic/banner/v2/academicTerms/current";
  const currentTermResponse = await fetch(currentTermEndpoint);
  return (await currentTermResponse.json()).data;
}

export async function getAllTermsFromApi() {
  const allTermsEndpoint =
    "https://ws.miamioh.edu/api/academic/banner/v2/academicTerms";
  const allTermsResponse = await fetch(allTermsEndpoint);
  return (await allTermsResponse.json()).data;
}

export async function loadTermsFromApi() {
  const currentTerm = await getCurrentTermFromApi();
  const allTerms = await getAllTermsFromApi();

  const currentTermAndUp: ApiTerm[] = allTerms.filter(
    (term: ApiTerm) =>
      Number(term.termId) >= Number(currentTerm.termId) &&
      Number(term.termId) <= Number(currentTerm.termId) + 100
  );
  return currentTermAndUp;
}

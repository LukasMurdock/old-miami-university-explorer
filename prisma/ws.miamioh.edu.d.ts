export type ApiTerm = {
    termId: string;
    name: string;
    startDate: string;
    endDate: string;
    academicTermResource: string;
    displayTerm: boolean;
};

export type ApiCourseSection = {
    academicTerm: string; // 202220
    academicTermDesc: string; // Spring Semester 2021-22
    courseId: string; // 22472 -> Course registration number (CRN)
    recordNumber: string; // 1
    courseCode: string; // PSY 111 A
    schoolCode: string; // AS
    schoolName: string; // College of Arts and Science
    deptName: string; // Psychology
    deptCode: string; // PSY
    standardizedDivisionCode: string; // CAS
    standardizedDivisionName: string; // College of Arts & Science"
    standardizedDeptCode: string; // PSY
    standardizedDeptName: string; // Psychology
    traditionalStandardizedDeptCode: string; // PSY
    traditionalStandardizedDeptName: string; // Psychology
    courseTitle: string; // Introduction to Psychology
    instructionalType: string; // L
    instructionalTypeDescription: string; // Lecture
    courseSubjectCode: string; // PSY
    courseSubjectDesc: string; // Psychology
    courseNumber: string; // 111
    courseSectionCode: string; // A
    courseStatus: string; // Inactive
    campusCode: string; // O
    campusName: string; // Oxford
    creditHoursDesc: string;
    creditHoursHigh: string;
    creditHoursLow: string;
    lectureHoursDesc: string;
    lectureHoursLow: string;
    lectureHoursHigh: string;
    labHoursDesc: string;
    labHoursLow: string;
    labHoursHigh: string;
    enrollmentCountMax: string;
    enrollmentCountCurrent: string;
    enrollmentCountActive: string;
    enrollmentCountAvailable: string;
    partOfTermCode: string; // 1
    partOfTermName: string; // Full Semester
    partOfTermStartDate: string;
    partOfTermEndDate: string;
    midtermGradeSubmissionAvailable: string;
    finalGradeSubmissionAvailable: string;
    gradeRequiredFinal: string;
    courseDescription: string;
    prntInd: string;
    courseSchedules: ApiCourseSchedule[];
    instructors: ApiInstructor[];
    attributes: ApiCourseAttribute[];
    crossListedCourses: any[];
    courseSectionResource: string;
    enrollmentResource: string;
    academicTermResource: string;
};

export interface ApiCourseSchedule {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    room: string;
    buildingCode: string;
    buildingName: string;
    days: string;
    scheduleTypeCode: string;
    scheduleTypeDescription: string;
}

export interface ApiInstructor {
    username: string;
    nameLast: string;
    nameFirst: string;
    nameMiddle: string;
    namePrefix: string;
    nameSuffix?: any;
    nameFirstPreferred?: any;
    nameDisplayInformal: string;
    nameDisplayFormal: string;
    nameSortedInformal: string;
    nameSortedFormal: string;
    personResource: string;
    primaryInstructor: string;
}

export interface ApiCourseAttribute {
    attributeCode: string;
    attributeDescription: string;
}

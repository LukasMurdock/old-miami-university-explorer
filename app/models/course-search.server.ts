import { CourseInstance } from "@prisma/client";
import { prisma } from "~/db.server";

// Result types
//      1. subject (CSE)
//      2. course (CSE 252)
//      3. section (CSE 252 A)

// while typing
//      strings < 3
//      assume subject code, sort by subject code with

// types of searches
// Strings
//    1. subject (CSE) (C)
//    2. title (Introduction to Marketing) (Intr)
//    3. description (design principles) (desi)

// Numbers
//    1. code (252) (2)
//    2. CRN (43035) (4)

// Strings and Numbers (trim)
//    1. subject code (CSE252, CSE 252)

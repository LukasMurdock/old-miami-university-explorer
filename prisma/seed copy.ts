import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedCourses } from "./course-seed";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  //   await prisma.courseInstance.create({
  //     data: {
  //       id: "20181",
  //       campus: "O",
  //       subject: "AES",
  //       code: 122,
  //       term: "202220",
  //       section: "A",
  //       description:
  //         "122 Heritage and Values of the United States Air Force (1) \n\nContinuation of AES 121. Further addres...",
  //       instructionType: "Lecture",
  //       credits: 1,
  //       enrollmentMax: 10,
  //     },
  //   });

  await seedCourses();

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

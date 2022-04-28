## TODO

- Port to new clean Remix project without auth and testing stuff
- Make favicon
- Add metadata
- Add JSON schema metadata to course pages and buildings

---

[Search course titles and descriptions]

Data with known URL -> The Cache API
Application state, UGC -> IndexedDB xx (saved classes)

Online -> search server-side with Remix SQLite;

Offline -> search client-side with cached [year]-all.json or Cache API.

Build Steps:

1. Ping all subject endpoints
2. Load CourseInstances into database (SQLite file).
3. Generate [year]-all.json with all course instances lexicographical sorted by Subject+Code+Year+Section (cache-able)
4. Client side search

Subject+Code+Year+Section

- Subject
  - Code
    - Year
      - Section

ECO 202 2022 A

Remix Indie Stack:

- Fly app deployment
- SQLite database
- Prisma ORM
- Tailwind
- Typescript

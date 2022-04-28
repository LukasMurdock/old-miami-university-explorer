import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import { SearchInput } from "./search";

export default function Index() {
  const user = useOptionalUser();
  return (
    <article>
      <h1>Miami University Explorer</h1>
      <p className="subtitle">Lukas Murdock</p>
      <section>
        <p>
          Miami University Explorer provides an easy way to explore classes at
          Miami University.
        </p>
      </section>
      <section>
        <h2>See course subjects</h2>
        <p>
          <Link to="/courses/">Subjects</Link>
        </p>
        <h2>Example searches</h2>
        <p>
          <Link to="/courses/cse">/courses/cse</Link>
        </p>
        <p>
          <Link to="/courses/cse/148">/courses/cse/148</Link>
        </p>
        <p>
          <Link to="/courses/cse/148/A">/courses/cse/A</Link>
        </p>
      </section>
    </article>
  );
}

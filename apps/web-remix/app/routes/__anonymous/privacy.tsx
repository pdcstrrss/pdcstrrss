export default function Privacy() {
  return (
    <article className="page container container-md">
      <header className="page-header">
        <h1 className="page-header-title">Privacy</h1>
      </header>
      <section>

        <p>So, what external services do we use and why?</p>

        <h2 className="h4">Netlify</h2>
        <h2 className="h4">Planetscale</h2>

        <h2 className="h4">Sentry</h2>
        <p>
          Writing good software is hard. Making mistakes is human. Things will break and when they do, we want to know
          why, <strong>without</strong> you having to tell us. Something breaks? Sentry (hopefully) will shout at us and
          give us insight in to the cause of why things are breaking.

          More about how Sentry processes it's data can be found in <a href="https://sentry.io/legal/dpa/" rel="noopener noreferrer">their DPA</a>.
        </p>

        <h2 className="h4">Plausible</h2>
        <h2 className="h4"></h2>
      </section>
    </article>
  );
}

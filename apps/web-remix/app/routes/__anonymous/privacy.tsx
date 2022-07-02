export default function Privacy() {
  return (
    <article className="page container container-md">
      <header className="page-header">
        <h1 className="page-header-title">Privacy</h1>
      </header>

      <p>We rely on external services. What data do they retain?</p>

      <section className="mt-5">
        <h2 className="h4">
          <a href="https://netlify.com" target="_blank" rel="noopener noreferrer">
            Netlify
          </a>
        </h2>

        <p>
          This thing has to run fast and easily deployable, and that's what Netlify does. As per their{' '}
          <a href="https://www.netflify.com/gdpr-ccpa">GDPR/CCPA</a> policy, they only collect IP-addresses and keep 'm
          for 30 days.
        </p>
      </section>

      <section className="mt-5">
        <h2 className="h4">
          <a href="https://planetscale.com/" target="_blank" rel="noopener noreferrer">
            PlanetScale
          </a>
        </h2>

        <p>
          PlanetScale claims to be a <strong>serverless</strong> MySQL database platform. That had me triggered, as I am
          not one wanting to deal with database scaling. Checkout the types of data we save in our{' '}
          <a href="https://github.com/pdcstrrss/pdcstrrss/blob/main/libs/database/prisma/schema.prisma">
            database schema
          </a>
          . All data is saved in the EU.
        </p>
      </section>

      <section className="mt-5">
        <h2 className="h4">
          <a href="https://sentry.io/" target="_blank" rel="noopener noreferrer">
            Sentry
          </a>
        </h2>
        <p>
          Writing good software is hard. Making mistakes is human. Things will break and when they do, we want to know
          why, <strong>without</strong> you having to tell us. Something breaks? Sentry (hopefully) will shout at us and
          give us insight in to the cause of why things are breaking. More about how Sentry processes it's data can be
          found in{' '}
          <a href="https://sentry.io/legal/dpa/" rel="noopener noreferrer">
            their DPA
          </a>
          .
        </p>
      </section>

      <section className="mt-5">
        <h2 className="h4">
          <a href="https://plausible.io/" target="_blank" rel="noopener noreferrer">
            Plausible
          </a>
        </h2>
        <p>
          Of course you'd like to have some insights in your website traffic, don't you?. Well, we pay for Plausible
          because it's an Open Source, privacy focused, GDPR compliant tool that helps us understand our network
          traffic. Visit their <a href="https://plausible.io/data-policy">Data Policy</a> see exactly what information
          they collect.
        </p>
      </section>

      <br />
    </article>
  );
}

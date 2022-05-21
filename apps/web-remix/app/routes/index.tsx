import { IndexViewLinks } from '@pdcstrrss/ui';
import { Link } from '@remix-run/react';

export const links = () => [...IndexViewLinks()];

export const handle = {
  hero: true,
};

export default function Index() {
  return (
    <main>
      <section className="container hero" style={{ paddingBlockEnd: 'var(--step-8)' }}>
        <h1 className="hero-title">
          Play podcasts <span className="text-no-wrap">via RSS</span>
        </h1>
        <p>Why the fancy marketing lingo?</p>
        <p>
          <Link to="/login" className="button button-secondary button-wide">
            Create a free account
          </Link>
        </p>
        <small>... and connect 3 feeds</small>
      </section>
      <section className="container container-md" style={{ paddingBlock: 'var(--step-8)', textAlign: 'center' }}>
        <h2 className="display-heading">More than 3 feeds?</h2>
        <div style={{ margin: '0 auto', maxInlineSize: '760px' }}>
          <p>Become a supporter!</p>
          <p>
            PDCSTRRSS is <strong className="text-primary">Open Source</strong>, cares about your{' '}
            <strong className="text-primary">privacy</strong> and that’s why we only find it{' '}
            <strong className="text-primary">fair</strong> to ask for sponsoring instead of selling your data.
          </p>
          <p>
            By sponsoring only <strong className="text-primary">$2 a month</strong>, you’ll be able to add{' '}
            <strong className="text-primary">more than 3 feeds</strong> and you’ll help us keep our machines running.
          </p>
          <Link to="/sponsor" className="button button-primary button-wide">
            <svg>
              <use xlinkHref="#github" />
            </svg>
            Sponsor via GitHub
          </Link>
        </div>
      </section>
    </main>
  );
}

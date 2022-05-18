import { IndexViewLinks } from '@pdcstrrss/ui';
import { Link } from '@remix-run/react';

export const links = () => [...IndexViewLinks()];

export const handle = {
  hero: true,
};

export default function Index() {
  return (
    <main>
      <section className="container hero">
        <h1 className="hero-title">
          Play podcasts <span className="text-no-wrap">via RSS</span>
        </h1>
        <p>Why the fancy marketing lingo?</p>
        <p>
          <Link to="/login" className="button button-secondary button-wide">
            Create a free account
          </Link>
        </p>
        <p>
          <small>... and connect 3 feeds</small>
        </p>
      </section>
      <section className="container" style={{ paddingBlock: '3rem' }}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. <a href="#">Ab, dolore consectetur</a> adipisci ex
          nemo eum quam corrupti numquam architecto facere libero exercitationem iusto, eius ratione iure cumque
          voluptatum! Voluptatem, quaerat.
        </p>
        <p>
          At iusto nulla similique temporibus voluptas id minus quod nemo perferendis assumenda. Debitis, laudantium
          harum! Possimus nostrum minus alias fuga! Alias mollitia voluptatibus obcaecati ad quo, quia enim nihil
          placeat!
        </p>
        <p>
          Est, ducimus ad modi natus totam alias eaque quos vero iusto tempora eius necessitatibus. Iusto veniam libero
          ex fugit? Soluta veniam necessitatibus aspernatur dignissimos blanditiis repellat nisi praesentium ratione
          inventore!
        </p>
      </section>
    </main>
  );
}

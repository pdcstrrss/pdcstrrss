import { authenticator } from "~/services/auth.server";
import { Button, links as buttonLinks } from "~/components/Button/Button";
import { LoaderFunction } from "@remix-run/server-runtime";

export const loader: LoaderFunction = async ({ request }): Promise<null> => {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/episodes",
  });
};

export const links = () => [...buttonLinks()];

export default function Index() {
  return (
    <div data-page-index>
      <div data-anonymous-index>
        <div data-card>
          <h1 data-title>PDCSTRRSS</h1>
          <p><strong>The RSS PodCast PWA</strong></p>
          <ul className="list-unstyled">
            <li>Login with GitHub</li>
            <li>
              Sponsor the project for only <strong>$1 / month</strong>
            </li>
            <li>Configure</li>
            <li>Listen</li>
          </ul>
          <form action="/auth/github" method="post" style={{ display: "inline-block" }}>
            <Button>
              <svg style={{ inlineSize: "var(--space)", blockSize: "var(--space)" }}>
                <use xlinkHref="#github" />
              </svg>
              <span>Login with GitHub</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

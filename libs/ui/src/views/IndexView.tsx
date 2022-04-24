import { Button, ButtonLinks } from '@pdcstrrss/ui';

export const IndexViewLinks = () => [...ButtonLinks()];

export interface IIndexViewProps {
  loginWithGitHubAction?: string;
}

export function IndexView({loginWithGitHubAction = '/auth/github'}: IIndexViewProps) {
  return (
    <div data-page-index>
      <div data-anonymous-index>
        <div data-card>
          <h1 data-title>PDCSTRRSS</h1>
          <p>
            <strong>The RSS PodCast PWA</strong>
          </p>
          <ul className="list-unstyled">
            <li>Login with GitHub</li>
            <li>
              Sponsor the project for only <strong>$1 / month</strong>
            </li>
            <li>Configure</li>
            <li>Listen</li>
          </ul>
          <form
            action={loginWithGitHubAction}
            method="post"
            style={{ display: 'inline-block' }}
          >
            <Button>
              <svg
                style={{
                  inlineSize: 'var(--space)',
                  blockSize: 'var(--space)',
                }}
              >
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

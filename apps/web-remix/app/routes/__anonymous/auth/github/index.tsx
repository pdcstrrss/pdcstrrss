import { LoaderFunction, redirect, ActionFunction } from '@remix-run/server-runtime';
import { authenticator } from '../../../../services/auth.server';

export const loader: LoaderFunction = ({ request }) => authenticator.authenticate('github', request);

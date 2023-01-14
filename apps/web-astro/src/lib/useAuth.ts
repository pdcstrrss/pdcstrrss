import { ROUTES } from './useRoutes';

export async function logout() {
  await fetch(location.origin + ROUTES.logout, {
    method: 'DELETE',
  });
  location.reload();
}

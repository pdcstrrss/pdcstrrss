export const LOGIN_API_URL = '/api/auth/login';

export async function logout() {
  await fetch(location.origin + '/api/auth/signout', {
    method: 'DELETE',
  });
  location.reload();
}

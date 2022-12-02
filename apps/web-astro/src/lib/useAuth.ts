export async function logout() {
  await fetch(location.origin + '/api/auth/signout', {
    method: 'DELETE',
  });
  location.reload();
}

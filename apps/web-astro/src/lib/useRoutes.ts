export const ROUTES = {
  // Pages
  home: '/',
  app: '/app',
  privacy: '/privacy',
  get feeds() {
    return `${this.app}/feeds`;
  },
  get feedsCreate() {
    return `${this.feeds}/create`;
  },
  get feedsDelete() {
    return (id: string) => `${this.feeds}/${id}/delete`;
  },
  get episodes() {
    return `${this.app}/episodes`;
  },
  get account() {
    return `${this.app}/account`;
  },

  // API
  api: '/api',
  get auth() {
    return `${this.api}/auth`;
  },
  get login() {
    return `${this.auth}/auth`;
  },
  get logout() {
    return `${this.auth}/signout`;
  },
};

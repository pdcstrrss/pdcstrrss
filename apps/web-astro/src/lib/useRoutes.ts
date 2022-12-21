export const ROUTES = {
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
  auth: '/auth',
  get github() {
    return `${this.auth}/github`;
  },
};

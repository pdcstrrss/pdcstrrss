export default {
  app: '/app',
  privacy: '/privacy',
  get feeds() {
    return `${this.app}/feeds`;
  },
  get feedsCreate() {
    return `${this.feeds}/create`;
  },
  feedsDelete(id: string) {
    return `${this.feeds}/${id}/delete`;
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

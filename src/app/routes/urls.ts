const urltree = require('urltree');

export const urls = urltree({
  'token': '/token',
  'list': '/list',
  'broadcast': '/broadcast',
  "inactivate": "/inactivate/:id",
  "userPreferences": "/preferences"
});
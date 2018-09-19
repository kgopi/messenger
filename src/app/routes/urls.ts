const urltree = require('urltree');

export const urls = urltree({
  'token': '/token',
  'broadcast': '/broadcast',
  "inactivate": "/inactivate/:id",
  "userPreferences": "/preferences"
});
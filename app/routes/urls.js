const urltree = require('urltree');

const urls = urltree({
  'token': '/token',
  'broadcast': '/broadcast',
  "inactivate": "/inactivate/:id"
});

module.exports = urls;

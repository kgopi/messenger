const urltree = require('urltree');

export const urls = urltree({
  'token': '/token',
  'list': '/list',
  'subscribe2Entity': '/entity/subscribe',
  'unsubscribe2Entity': '/entity/unsubscribe/:id',  
  'subscribe2Event': '/event/subscribe/:media/:area:/:eventName',
  'unsubscribe2Event': '/event/unsubscribe/:id',
  'broadcast': '/broadcast',
  "preferences": "/preferences"
});
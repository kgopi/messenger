const urltree = require('urltree');

export const urls = urltree({
  'token': '/token',
  'list': '/list',
  'subscribe2Entity': '/entity/subscribe/:entityName/:entityId',
  'unsubscribe2Entity': '/entity/unsubscribe/:entityId',
  'subscribe2Event': '/event/subscribe/:media/:area/:eventName',
  'unsubscribe2Event': '/event/unsubscribe/:media/:area/:eventName',
  'subscribe2Channel': '/channel/subscribe/:media',
  'unSubscribe2Channel': '/channel/unsubscribe/:media',
  'broadcast': '/broadcast',
  "preferences": "/preferences"
});
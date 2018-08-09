# Haystack Bot Server

Participate in the quest of a lifetime. Discover environment-aware peers, sensors and services to level-up your KP (knowledge points). Interact with contexts and help friends with their ideas/ problems.

  - `var` is function scoped and global scoped if not declared
  - `var` can be accessed before declared but gives undefined
  - `let` is block scoped and cannot be accessed before declared
  - `const` is same as let (block scoped) but cannot re-assign value; but can re-assign existing property if its an object
  - Keep and eye on hoisting path with respect to functions and variables

#####Sample trigger message
```js
{
  type: <type of event>,
  user: <unique id of user who sent the message>,
  channel: <unique id for channel or 1:1 conversation>,
  text: <text of message or primary payload value if present>,
  raw_message: <the original event data>
}
```

#####Sample address
```js
{
  id: '1526582390281',
  channelId: 'skype',
  user: {
    id: '29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo',
    name: 'Vinay Naik'
  },
  conversation: {
    id: '29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo'
  },
  bot: {
    id: '28:87f7bec1-3ca5-4c02-9fc6-1a1fa5aaa520',
    name: 'Quest'
  },
  serviceUrl: 'https://smba.trafficmanager.net/apis/'
}
```


#####Sample message object
```js
{ text: '!link me',
  type: 'message_received',
  timestamp: '2018-05-29T10:21:50.085Z',
  entities:
   [ { locale: 'en-GB',
       country: 'IN',
       platform: 'Mac',
       type: 'clientInfo' } ],
  sourceEvent: { text: '!link me' },
  attachments: [],
  address:
   { id: '1527589310011',
     channelId: 'skype',
     user:
      { id: '29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo',
        name: 'Vinay Naik' },
     conversation: { id: '29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo' },
     bot: { id: '28:87f7bec1-3ca5-4c02-9fc6-1a1fa5aaa520', name: 'Quest' },
     serviceUrl: 'https://smba.trafficmanager.net/apis/' },
  source: 'skype',
  raw_message:
   { text: '!link me',
     type: 'message',
     timestamp: '2018-05-29T10:21:50.085Z',
     entities: [ [Object] ],
     sourceEvent: { text: '!link me' },
     attachments: [],
     address:
      { id: '1527589310011',
        channelId: 'skype',
        user: [Object],
        conversation: [Object],
        bot: [Object],
        serviceUrl: 'https://smba.trafficmanager.net/apis/' },
     source: 'skype' },
  _pipeline: { stage: 'receive' },
  user: 'skype:29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo',
  channel: 'skype:29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo',
  haystack_data:
   { id: 'skype:29:1d9VvOaHnUNzy5ljbPupZOXt9VSyFlOEigqorpBiJJDo',
     linked_to_haystack: false },
  match: [ '!link', index: 0, input: '!link me', groups: undefined ] }
```



###Sample contact add/remove message object
```js
{ action: 'add',
  type: 'contactRelationUpdate',
  timestamp: '2018-08-09T11:08:02.083Z',
  entities: [ { locale: 'en', platform: 'Windows', type: 'clientInfo' } ],
  text: '',
  attachments: [],
  address:
   { id: 'f:0',
     channelId: 'skype',
     user:
      { id: '29:17xaXsLBw-bVOq6zr-S4TctSv-V79mGRlJHFfBD2RyFQXZnjDhVe2g27QfFnu7UHE',
        name: 'Vinay Naik' },
     conversation:
      { id: '29:17xaXsLBw-bVOq6zr-S4TctSv-V79mGRlJHFfBD2RyFQXZnjDhVe2g27QfFnu7UHE' },
     bot: { id: '28:87f7bec1-3ca5-4c02-9fc6-1a1fa5aaa520', name: 'Quest' },
     serviceUrl: 'https://smba.trafficmanager.net/apis/' },
  source: 'skype',
  raw_message:
   { action: 'add',
     type: 'contactRelationUpdate',
     timestamp: '2018-08-09T11:08:02.083Z',
     entities: [ [Object] ],
     text: '',
     attachments: [],
     address:
      { id: 'f:0',
        channelId: 'skype',
        user: [Object],
        conversation: [Object],
        bot: [Object],
        serviceUrl: 'https://smba.trafficmanager.net/apis/' },
     source: 'skype' },
  _pipeline: { stage: 'receive' },
  user: 'skype:29:17xaXsLBw-bVOq6zr-S4TctSv-V79mGRlJHFfBD2RyFQXZnjDhVe2g27QfFnu7UHE',
  channel: 'skype:29:17xaXsLBw-bVOq6zr-S4TctSv-V79mGRlJHFfBD2RyFQXZnjDhVe2g27QfFnu7UHE',
  haystack_locale: 'en',
  haystack_data:
   { id: 'skype:29:17xaXsLBw-bVOq6zr-S4TctSv-V79mGRlJHFfBD2RyFQXZnjDhVe2g27QfFnu7UHE',
     linked_to_haystack: false } }
```

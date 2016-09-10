var Way = (function (global, document, exports, undefined) {
  'use strict';
  exports.CLASS_CHAT_FROM = 'from-them';
  exports.CLASS_CHAT_TO   = 'to-them';
  function add_connection (pool, conn) {
    if (!pool[conn.peer]) {
      pool[conn.peer] = conn;
    }
    return pool[conn.peer];
  }
  function chat_from (display, text, from) {
    var chat = document.createElement('span');
    chat.textContent = from +' : '+ text;
    chat.className = ['chat', exports.CLASS_CHAT_FROM].join(' ');
    display.appendChild(chat);
  }
  function chat_to (display, text, to) {
    var chat = document.createElement('span');
    chat.textContent = to +' : '+ text;
    chat.className = ['chat', exports.CLASS_CHAT_TO].join(' ');
    display.appendChild(chat);
  }
  loadJson('./specifications/env.json', function (env) {
    console.log('environment loaded');
    var
      apikey = env.SKYWAY_API_KEY,
      peer = exports.peer = new Peer({key: apikey}),
      pool = exports.connections = {},
      display = exports.display = document.getElementById('chat-display'),
      message = document.getElementById('chat-message');

    document.getElementById('peer-connect').onclick = function peerConnect (event) {
      peer.listAllPeers(function (list) {
        var others = list.filter(function (p, idx) {
          return p !== peer.id;
        });
        others.forEach(function (p) {
          if (!pool[p]) {
            console.log("Make connection to:", p);
            var conn = add_connection(pool, peer.connect(p));
            conn.on('data', function (data) {
              console.log('Connection data received', data);
              chat_from(display, data.message, data.from);
            });
          }
        });
      });
    };
    document.getElementById('chat-send').onclick = function sendMessage (event) {
      console.log("Message text:", message.value);
      Object.keys(pool).forEach(function (key) {
        var conn = pool[key];
        console.log("Sending message to:", conn.peer);
        conn.send({
          from: peer.id,
          to: conn.peer,
          message: message.value
        });
        chat_to(display, message.value, conn.peer);
      });
    };

    peer.on('connection', function (conn) {
      console.log('Peer connected:', conn);
      add_connection(pool, conn);
      conn.on('data', function (data) {
        console.log('Connection data received', data);
        chat_from(display, data.message, data.from);
      });
    });

  });
  return exports;
})(this, this.document, {})

console.log(Way);

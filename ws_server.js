console.log("Server started");

var WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({ port: 8010 });

let userCount = 0;

function broadcast(message) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", function (ws) {
  userCount++;
  ws.username = "user" + userCount;
  console.log(`${ws.username} connected`);

  broadcast("Current number of connected users: " + userCount);

  ws.on("message", function (message) {
    console.log("Received from %s: %s", ws.username, message);
    broadcast(ws.username + " says: " + message);
  });

  ws.on("close", function () {
    userCount--;
    console.log(`${ws.username} disconnected`);
    broadcast(ws.username , "disconnected. Current number of connected users: " + userCount);
  });
});


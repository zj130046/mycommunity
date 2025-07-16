/* eslint-disable @typescript-eslint/no-var-requires */

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3001 });

let clients = [];

wss.on("connection", function connection(ws) {
  clients.push(ws);

  ws.on("message", function incoming(data) {
    // 广播给所有客户端
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
});

console.log("WebSocket server running on ws://localhost:3001");

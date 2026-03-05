const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 3001 });

let clients = [];

// 心跳检测间隔（毫秒）
const HEARTBEAT_INTERVAL = 30000; // 30秒

wss.on("connection", function connection(ws) {
  console.log("新的WebSocket连接建立");
  clients.push(ws);

  // 设置心跳检测
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", function incoming(data) {
    try {
      // 处理心跳消息
      if (data.toString() === "ping") {
        ws.send("pong");
        return;
      }

      // 广播给所有客户端
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(data);
          } catch (error) {
            console.error("发送消息失败:", error);
            // 移除失效的客户端
            clients = clients.filter((c) => c !== client);
          }
        }
      });
    } catch (error) {
      console.error("处理消息失败:", error);
    }
  });

  ws.on("close", () => {
    console.log("WebSocket连接关闭");
    clients = clients.filter((client) => client !== ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket连接错误:", error);
    clients = clients.filter((client) => client !== ws);
  });
});

// 定期清理失效连接
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log("清理失效的WebSocket连接");
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, HEARTBEAT_INTERVAL);

wss.on("close", () => {
  clearInterval(interval);
});

console.log("WebSocket server running on ws://localhost:3001");

// server.js
import { WebSocketServer } from "ws";

// Create WebSocket server on port 3001
const wss = new WebSocketServer({ port: 3001 });

console.log("🚀 WebSocket server started on ws://localhost:3001");

// Ping interval to detect dead connections
const pingInterval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.isAlive === false) {
      console.log("💀 Terminating dead client");
      return client.terminate();
    }

    client.isAlive = false;
    client.ping(); // ask for pong
  });
}, 30000); // every 30 seconds

wss.on("connection", (ws) => {
  console.log("✅ New client connected");

  // Mark client as alive
  ws.isAlive = true;

  // Listen for pongs
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // (Optional) Handle incoming messages from clients
  ws.on("message", (message) => {
    console.log("📨 Received from client:", message.toString());
  });

  // Welcome message to client
  ws.send(JSON.stringify({ message: "👋 Welcome to Reaction Server!" }));
});

// Helper: Broadcast to all clients
export function broadcastReactionUpdate(update) {
  const data = JSON.stringify(update);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      // WebSocket.OPEN
      client.send(data);
    }
  });
}

// Gracefully cleanup
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");
  clearInterval(pingInterval);
  wss.close(() => {
    console.log("✅ WebSocket server closed");
    process.exit(0);
  });
});

import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export default function createWebSocketServer(port: Number) {
  const httpServer = createServer();
  const io = new SocketIOServer(httpServer, {});

  io.on("connection", (socket) => {
    console.log("Client connected");

    // Event listener for messages from clients
    socket.on("message", (message: string) => {
      console.log(`Received message => ${message}`);

      // Echo message back to the client
      socket.emit("message", `Echo: ${message}`);
    });

    // Event listener for when a client disconnects
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Start the HTTP server
  httpServer.listen(port, () => {
    console.log(`Socket.IO server started on port ${port}`);
  });
}

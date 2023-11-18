import { Server } from "socket.io";
require("dotenv").config();

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      connectionStateRecovery: {},
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("message-client", (msg) => {
        socket.broadcast.emit("message-server", msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;

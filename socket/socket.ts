// import express, { Application } from "express";
// import http from "http";
// import { Server, Socket } from "socket.io";
// import "colors";

// const app: Application = express();
// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// interface OnlineUser {
//     sid: string;
//     uid: string;
// }

// let ONLINE_USERS: OnlineUser[] = [];
// let TYPING: string[] = [];
// io.on("connection", (socket: Socket) => {
//     console.log("New connection:", socket.id);

//     socket.on("join-chat", (data: { _id: string }) => {
//         socket.join(data._id);
//         ONLINE_USERS.push({ sid: socket.id, uid: data._id });
//         io.emit("online-response", ONLINE_USERS);
//         console.log("User joined chat:", data._id);
//     });

//     socket.on("disconnect", () => {
//         ONLINE_USERS = ONLINE_USERS.filter((item) => item.sid !== socket.id);
//         io.emit("online-response", ONLINE_USERS);
//         console.log("User disconnected:", socket.id);
//     });
// });

// export { app, server, io, ONLINE_USERS };
import express from "express"
import http from "http"

import { Server } from "socket.io"
const app = express()

const httpServer = http.createServer(app)

const io = new Server(httpServer, { cors: { origin: "*" } })

// module.exports = { io, app, httpServer }
export { io, app, httpServer }

// // const express = require('express');
// // const app = express();
// // const http = require('http');
// // const path = require('path');
// // const { Server } = require('socket.io');
// // const ACTIONS = require('./src/Actions');

// // const server = http.createServer(app);
// // const io = new Server(server);

// // app.use(express.static('build'));
// // app.use((req, res, next) => {
// //     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// // });

// // const userSocketMap = {};
// // function getAllConnectedClients(roomId) {
// //     // Map
// //     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
// //         (socketId) => {
// //             return {
// //                 socketId,
// //                 username: userSocketMap[socketId],
// //             };
// //         }
// //     );
// // }

// // io.on('connection', (socket) => {
// //     console.log('socket connected', socket.id);

// //     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
// //         userSocketMap[socket.id] = username;
// //         socket.join(roomId);
// //         const clients = getAllConnectedClients(roomId);
// //         clients.forEach(({ socketId }) => {
// //             io.to(socketId).emit(ACTIONS.JOINED, {
// //                 clients,
// //                 username,
// //                 socketId: socket.id,
// //             });
// //         });
// //     });

// //     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
// //         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
// //     });

// //     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
// //         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
// //     });

// //     socket.on('disconnecting', () => {
// //         const rooms = [...socket.rooms];
// //         rooms.forEach((roomId) => {
// //             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
// //                 socketId: socket.id,
// //                 username: userSocketMap[socket.id],
// //             });
// //         });
// //         delete userSocketMap[socket.id];
// //         socket.leave();
// //     });
// // });

// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => console.log(`Listening on port ${PORT}`));





// const express = require('express');
// const cors = require('cors'); // Add this line
// const app = express();
// const http = require('http');
// const path = require('path');
// const { Server } = require('socket.io');
// const ACTIONS = require('./src/Actions');

// app.use(cors({
//   origin: "https://your-frontend.vercel.app",  // ← Yahan apne Vercel frontend ka URL daal dena
//   credentials: true
// }));

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "https://your-frontend.vercel.app",  // Socket.io ke liye bhi cors
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// // app.use(express.static('build'));
// // app.use((req, res, next) => {
// //     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// // });

// const userSocketMap = {};
// function getAllConnectedClients(roomId) {
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//         (socketId) => {
//             return {
//                 socketId,
//                 username: userSocketMap[socketId],
//             };
//         }
//     );
// }

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
//         socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
//         io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Listening on port ${PORT}`));







const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

app.use(cors({
  origin: "https://realtime-editor-frontend.vercel.app", // ✅ Replace with your Vercel frontend URL
  credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://realtime-editor-frontend.vercel.app", // ✅ Same here
    methods: ["GET", "POST"],
    credentials: true
  }
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
// For Socket IO
import { createServer } from "http";
import { Server, Socket } from "socket.io";
// import routes
import authRoute from "./route/authRoute";
import userRoute from "./route/userRoute";
import chatRoute from "./route/chatRoute";
import testPopulateRoute from "./route/testPopulate/testPopulateRoute";

const roooms = ["general", "random", "news", "games", "coding"];

// Socket IO server connected on 8080 port
const httpServer = createServer();
const socketIO = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// socket connection
// socketIO.on("connection", (socket: Socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);

//   socket.send("Welcome to Socket IO Server send data server to client");
//   // setInterval(() => {
//   //   let i=0
//   //   socket.send(i+1);
//   // }, 1000);

//   //custom event server to client
//   setTimeout(() => {
//     socket.emit("customEvent", "Custom event from server to client");
//   }, 2000);

//   // socket.on("joinRoom", async(roomName: string) => {
//   //   if (roooms.includes(roomName)) {
//   //     socket.join(roomName);
//   //     console.log(`🔥: ${socket.id} joined ${roomName} room!`);
//   //   }
//   // });

//   //getting data from client to server when client side thekey button a click hobey
//   socket.on("customEvent", (data: any) => {
//     console.log(`🔥: ${socket.id} send ${data} message!`);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔥: A user disconnected");
//   });
// });

//Broadcasting
// socketIO.on("connection", (socket: Socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);
//   //data send to all client from server
//   socketIO.sockets.emit("MyBroadcast", "Hello my all clients from server(broacasting)");

//   // socketIO.sockets.on("MyBroadcast", (data: any) => {
//   //   socket.broadcast.emit("MyBroadcast", data);
//   // });
//   socket.on("disconnect", () => {
//     console.log("🔥: A user disconnected");
//   });
// });

//namespace=>for group chat
// let buynameSpace=socketIO.of("/buy")
// let sellnameSpace=socketIO.of("/sell")

// //seperate data channel for buy and sell
// buynameSpace.on("connection", (socket: Socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);
//   //data send server to client
//   buynameSpace.emit("buyEvent","Buy Event")
// });

// sellnameSpace.on("connection", (socket: Socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);
//   sellnameSpace.emit("sellEvent","Sell Event")
// });

// //New Socket Io project :Room Concept in Socket IO
// socketIO.on("connection", (socket: Socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);
//   socket.emit("customEvent", "Custom event from server to client");

//   //client side to server a data recieve
//   // socket.on("chat", (data: any) => {
//   //   console.log(data);
//   //   //now again send data to  client side
//   //   socket.emit("clientChat", data);
//   // });

//   //create room(cooking-room)
//   socket.join('cooking-room')
//   socketIO.sockets.in('cooking-room').emit('cookingEvent', 'cooking event from server to client')

//   //create room(dinning-room)
//   socket.join('dinning-room')
//   //ekta room a kotojon present asey sheita amra jantey pari dinningEvent or dinningClean jara jara call korbey tarai dinning room a asey
//   let sizeOfTheDinningRoom=socketIO.sockets.adapter.rooms.get('dinning-room').size
//   //doita event dinning-room ar under a
//   socketIO.sockets.in('dinning-room').emit('dinningEvent', `how many people in the room: ${sizeOfTheDinningRoom}`)
//   socketIO.sockets.in('dinning-room').emit('dinningClean', 'clean the dinning room')

//   socket.on("disconnect", () => {
//     console.log("🔥: A user disconnected");
//   });
// });

//---------------------New Chat app video:creating chat app using chakra ui and socket io------------
socketIO.on("connection", (socket: Socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('joinRoom', ({ productId}:any) => {
    socket.join(`${socket.id} ${productId}`);
    console.log(`User joined room for product: ${productId}`);
  });

  //ai khnaey jei item post disey shey bid amount place kortey parbey na aita handle kora lagbey
  socket.on('placeBid', ({ productId, bidAmount }) => {
    console.log(`Bid of ${bidAmount} placed on product: ${productId}`);
    // Broadcast the new bid to all users in the room (usually kicho logic aro boshbey aikhanye)
    //https://socket.io/docs/v3/emit-cheatsheet/(follow this link for more info)
    socketIO.emit('newBid', { pId:productId, bAmount:bidAmount });
  });


  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

//socket io server listen on 8080 port
httpServer.listen(8080, () => {
  console.log(`Server listening on port 8080`);
});

//----------------------------------------//

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yz2oh.mongodb.net/typescript_fullstack?retryWrites=true&w=majority`
    );
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/create", testPopulateRoute);

//error middleware
app.use((err: any, req: any, res: any, next: any) => {
  const errorStatus = err.status || 500;
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: "Something Went Wrong",
    stack: err.stack,
  });
});

app.listen(9000, () => {
  connect();
  console.log("Connected to backend.");
});

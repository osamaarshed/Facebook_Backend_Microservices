const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = process.env.MESSAGES_PORT;

//Importing Routes
const routes = require("./Routes/routes");
const { saveMessages } = require("./Controllers/messages-controller");

//Mongo Connection
mongoose
  .connect(process.env.MONGODB_CONNECT)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });

//Routes
app.use("/", routes);

const server = app.listen(port, () => {
  console.log("Messages running on port: " + port);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User Connected: ", socket.id);
  //Join Room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("room no: ", data);
  });

  //Send Message
  socket.on("send_message", async (data) => {
    const [edittedData] = await saveMessages(data);
    io.to(data.chatRoomId).emit("recieve_message", edittedData);
  });

  //Start New Chat
  socket.on("send_new_message", async (data) => {
    const [newEdittedData] = await saveMessages(data);
    io.to(data.chatRoomId).emit("recieve_new_message", newEdittedData);
  });

  //On Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id);
  });
});

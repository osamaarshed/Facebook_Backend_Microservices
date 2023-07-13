const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { Server } = require("socket.io");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
const port = 8083;

//Importing Routes
const routes = require("./Routes/routes");
const { saveMessages } = require("./Controllers/messages-controller");

//Mongo Connection
mongoose.connect("mongodb://localhost:27017/facebook");

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

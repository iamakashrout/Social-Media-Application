import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { register } from "./controllers/authControllers.js";
import { createPost } from "./controllers/postControllers.js";
import { verifyToken } from "./middleware/auth.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import http from "http";
import { Server } from "socket.io";
import notifsRoutes from "./routes/notifsRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public//assets")));
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Debugging Log Middleware
app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);  
  next();
});
app.use(cors());

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
//app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/posts",verifyToken,upload.none(),createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);
app.use("/api", chatbotRoutes);
app.use("/notif", notifsRoutes);
app.use("/story", storyRoutes);

/* MONGOOSE SETUP */
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
     console.log("Database Connected Successfully!");
    //app.listen(PORT, () => console.log(`Server successfully running on Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));



  

  // SOCKET.IO FOR REAL TIME MESSAGING


  let users = [];

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  io.on("connection", (socket) => {
    console.log("a user connected.");

    // connection
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // send and receive messages
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });

    // disconnection
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });


   const PORT = process.env.PORT || 5000;
   server.listen(PORT, () =>
     console.log(`Server successfully running on Port: ${PORT}`)
   );

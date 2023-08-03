const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Create a Sequelize instance and connect to the database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.db", // Path to the SQLite database file
});

// Define the User model
const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Message = sequelize.define("Message", {
  messageText: {
    type: DataTypes.STRING,
  },
});

// Define the Chat model
const Chat = sequelize.define("Chat", {
  room: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

// Set up associations between Chat, User, and Message models
Chat.hasMany(Message);
Message.belongsTo(User, { as: "sender" });
Message.belongsTo(User, { as: "receiver" });

// Create the users table if it doesn't exist
User.sync();
Message.sync();
Chat.sync();

// Route to create a new user
app.post("/users", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.json({
        success: true,
        message: "User already exists",
        user: user,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({ email, name, password: hashedPassword });
    const userr = await User.findOne({ where: { email } });
    return res.json({ success: true, message: "User created", user: userr });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Route to handle user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    return res.json({
      success: true,
      message: "Login successful",
      user: user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json({ success: true, users });
  } catch (error) {
    console.error("Error getting users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
// Route to get all chats for a specific room
app.get("/chat", async (req, res) => {
  const { room } = req.query;

  if (!room) {
    return res.json({ success: false, message: "Room parameter is missing" });
  }

  try {
    const chat = await Chat.findOne({
      where: { room },
      include: [
        {
          model: Message,
          include: [
            { model: User, as: "sender", attributes: ["id", "name", "email"] },
            {
              model: User,
              as: "receiver",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    return res.json({ success: true, chat });
  } catch (error) {
    console.error("Error getting chat:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    // console.log(data);
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    console.log(data);
    const n1 = data.sender.id;
    const n2 = data.receiver ? data.receiver.id : 0;
    let temp = n1 > n2 ? n1 + " " + n2 : n2 + " " + n1;

    try {
      const [chat, created] = await Chat.findOrCreate({
        where: { room: temp },
      });

      const sender = await User.findByPk(n1);
      const receiver = data.receiver ? await User.findByPk(n2) : null;

      const message = await Message.create({
        messageText: data.message,
        senderId: sender.id,
        receiverId: receiver ? receiver.id : null,
      });

      await chat.addMessage(message);

      io.to(temp).emit("receive_message", data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
});

const port = process.env.PORT || 3001; // Use the port assigned by Glitch or 3001 if not provided
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

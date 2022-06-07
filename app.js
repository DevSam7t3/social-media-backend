const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}

const app = express();

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Importing  routes
const post = require("./routes/post");
const user = require("./routes/user");
const comments = require("./routes/comments");
const likes = require("./routes/likes");

// Using  routes
app.use("/api/v1/post", post);
app.use("/api/v1/user", user);
app.use("/api/v1/comments", comments);
app.use("/api/v1/like", likes);

module.exports = app;

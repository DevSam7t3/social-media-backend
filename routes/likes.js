const express = require("express");

const { likePost } = require("../controllers/likes");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/:id").post(isAuthenticated, likePost);

module.exports = router;

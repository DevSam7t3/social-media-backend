const express = require("express");
const {
  getComment,
  addComment,
  deleteComment,
} = require("../controllers/comment");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(isAuthenticated, addComment);
router.route("/:id").get(getComment).delete(isAuthenticated, deleteComment);

module.exports = router;

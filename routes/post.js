const express = require("express");
const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  postsOfSpesificUser,
} = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");

// TODO: implement auth middleware

const router = express.Router();

router.route("/").post(isAuthenticated, createPost).get(getAllPosts);

router
  .route("/:id")
  .patch(isAuthenticated, updatePost)
  .get(getPost)
  .delete(isAuthenticated, deletePost);

module.exports = router;

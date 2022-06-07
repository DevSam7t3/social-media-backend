const { Posts, Likes, Comments } = require("../models");

exports.createPost = async (req, res) => {
  try {
    let { title, postText } = req.body;
    const { username, id } = req.user;

    const post = await Posts.create({
      title,
      postText,
      owner: username,
      UserId: id,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll({ include: [Likes, Comments] });

    res.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Posts.findByPk(id);

    res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    let { title, postText } = req.body;

    const post = await Posts.findByPk(id);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Something Went Wrong. Please try again.",
      });
    }

    if (post.owner.toString() !== req.user.username.toString()) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (title) post.title = title;
    if (postText) post.postText = postText;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      updatedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await Posts.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Post deleted succesfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

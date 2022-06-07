const { Comments } = require("../models");

exports.addComment = async (req, res) => {
  try {
    const { commentBody, PostId } = req.body;
    const { username } = req.user;

    const comment = await Comments.create({
      commentBody,
      PostId,
      userName: username,
    });

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comments.findAll({
      where: {
        PostId: id,
      },
    });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comments.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted succesfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

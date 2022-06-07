const { Likes } = require("../models");

exports.likePost = async (req, res) => {
  try {
    const { id: PostId } = req.params;
    const { id, username } = req.user;

    const isLiked = await Likes.findOne({
      where: {
        PostId,
        UserId: id,
      },
    });

    if (isLiked) {
      await Likes.destroy({
        where: {
          PostId,
          UserId: id,
        },
      });

      res.status(200).json({
        success: true,
        message: "Post unLiked",
      });
    } else {
      await Likes.create({
        PostId,
        UserId: id,
        username,
      });

      res.status(200).json({
        success: true,
        message: "Liked a post",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

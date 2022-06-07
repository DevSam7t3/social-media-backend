const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Users, Posts, Likes, Comments } = require("../models");

exports.register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const ExistingUser = await Users.findOne({ where: { email } });
    if (ExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }
    password = (await bcrypt.hash(password, 12)).toString();
    const user = await Users.create({
      username,
      email,
      password,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );
    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );
    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.UserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    const posts = await Posts.findAll({
      where: {
        UserId: id,
      },
      include: [Likes],
    });

    res.status(200).json({
      success: true,
      user,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "User logged out",
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findByPk(id);

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "old password and new password must be privided",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }

    let password = (await bcrypt.hash(newPassword, 12)).toString();

    user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been successfully changed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { email } = req.body;

    const user = await Users.findByPk(id);

    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteMyProfile = async (req, res) => {
  try {
    const { id } = req.user;

    await Users.destroy({
      where: {
        id,
      },
    });

    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//TODO: testing and completing this block of code
exports.myProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await Users.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    const posts = await Posts.findAll({
      where: {
        UserId: id,
      },
      include: [Likes, Comments],
    });

    res.status(200).json({
      success: true,
      user,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: {
        exclude: ["password"],
      },
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

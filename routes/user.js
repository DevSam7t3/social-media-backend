const express = require("express");

const {
  register,
  login,
  UserProfile,
  logout,
  updatePassword,
  updateProfile,
  deleteMyProfile,
  myProfile,
  getAllUsers,
} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile/:id").get(UserProfile);
router.route("/logout").get(logout);
router.route("/update/password").patch(isAuthenticated, updatePassword);
router.route("/update/profile").patch(isAuthenticated, updateProfile);
router.route("/delete/me").delete(isAuthenticated, deleteMyProfile);
router.route("/me").get(isAuthenticated, myProfile);
router.route("/all").get(isAuthenticated, getAllUsers);

module.exports = router;

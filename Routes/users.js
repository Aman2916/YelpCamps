const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/errorAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const user = require("../controller/user");

router.get("/home", user.home);
router.get("/register", user.registerUser);

router.post("/register", catchAsync(user.formToRegisterUser));

router.get("/login", user.loginPage);

router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  user.loginUser
);

router.get("/logout", user.logout);
module.exports = router;

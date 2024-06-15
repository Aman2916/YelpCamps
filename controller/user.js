const User = require("../models/user");

module.exports.firstPage = (req, res) => {
  res.render("..views/home");
};
module.exports.home = (req, res) => {
  res.render("../views/home");
};

module.exports.registerUser = (req, res, next) => {
  res.render("../views/users/register.ejs");
};

module.exports.formToRegisterUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginPage = (req, res, next) => {
  res.render("../views/users/login.ejs");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  //delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash("success", "GoodBye :) See you Again.");
    res.redirect("/campgrounds");
  });
};

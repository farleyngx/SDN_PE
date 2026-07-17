const bcrypt = require("bcryptjs");
const Member = require("../../models/Member");

exports.getLoginView = (req, res) => {
  res.render("login", { error: null, user: req.session.currentUser || null });
};

exports.handleLogin = async (req, res) => {
  const { name, code } = req.body;
  try {
    const member = await Member.findOne({ name });
    if (!member) {
      return res.render("login", {
        error: "Invalid User Account Name!",
        user: null,
      });
    }

    const isMatch = bcrypt.compareSync(code, member.code);
    if (!isMatch) {
      return res.render("login", {
        error: "Incorrect member code!",
        user: null,
      });
    }

    req.session.currentUser = member;
    res.redirect("/admin/pens");
  } catch (err) {
    res.render("login", { error: err.message, user: null });
  }
};

exports.handleLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/access");
  });
};

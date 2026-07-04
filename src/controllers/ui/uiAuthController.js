const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

exports.getLoginView = (req, res) => {
  res.render("login", { error: null, user: req.session.currentUser || null });
};

exports.handleLogin = (req, res) => {
  const { name, code } = req.body;
  try {
    const filePath = path.join(__dirname, "../../data/members.json");
    const membersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const member = membersData.find((m) => m.name === name);
    if (!member) {
      return res.render("login", {
        error: "Invalid User Account Name!",
        user: null,
      });
    }

    const isMatch = bcrypt.compareSync(code, member.code);
    if (!isMatch) {
      return res.render("login", {
        error: "Incorrect member code secret!",
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

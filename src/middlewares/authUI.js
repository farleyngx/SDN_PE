module.exports = (req, res, next) => {
  if (req.session && req.session.currentUser) return next();
  res.render("login", {
    error: "Please login to access the system!",
    user: null,
  });
};

const Pen = require("../../models/Pen");
const Brand = require("../../models/Brand");

exports.getPenListView = async (req, res) => {
  try {
    const pens = await Pen.find().populate("brand");
    const brands = await Brand.find();

    const successMsg = req.session.successMsg || null;
    const errorMsg = req.session.errorMsg || null;

    delete req.session.successMsg;
    delete req.session.errorMsg;

    res.render("pens", {
      pens,
      brands,
      user: req.session.currentUser,
      successMsg,
      errorMsg,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addPen = async (req, res) => {
  try {
    const { penName, penDescription, image, pouch, off, gender, brand } =
      req.body;

    if (!/^[A-Za-z\s]+$/.test(penName)) {
      req.session.errorMsg = "Pen name must contain only letters and space!";
      return res.redirect("/admin/pens");
    }
    if (await Pen.findOne({ penName })) {
      req.session.errorMsg = "Pen name already exists!";
      return res.redirect("/admin/pens");
    }

    await new Pen({
      penName,
      penDescription,
      image,
      pouch: pouch === "on",
      off: parseFloat(off),
      gender: gender === "on",
      brand,
    }).save();

    req.session.successMsg = "Pen added successfully!";
    res.redirect("/admin/pens");
  } catch (err) {
    req.session.errorMsg = err.message;
    res.redirect("/admin/pens");
  }
};

exports.updatePen = async (req, res) => {
  try {
    const { penName, penDescription, image, pouch, off, gender, brand } =
      req.body;

    if (!/^[A-Za-z\s]+$/.test(penName)) {
      req.session.errorMsg = "Pen name must contain only letters and space!";
      return res.redirect(`/admin/pens/${req.params.penId}`);
    }
    if (await Pen.findOne({ penName, _id: { $ne: req.params.penId } })) {
      req.session.errorMsg = "Pen name already exists!";
      return res.redirect(`/admin/pens/${req.params.penId}`);
    }

    await Pen.findByIdAndUpdate(req.params.penId, {
      penName,
      penDescription,
      image,
      pouch: pouch === "on",
      off: parseFloat(off),
      gender: gender === "on",
      brand,
    });
    req.session.successMsg = "Pen updated successfully!";
    res.redirect(`/admin/pens/${req.params.penId}`);
  } catch (err) {
    req.session.errorMsg = err.message;
    res.redirect(`/admin/pens/${req.params.penId}`);
  }
};

exports.deletePen = async (req, res) => {
  try {
    await Pen.findByIdAndDelete(req.params.penId);
    req.session.successMsg = "Pen deleted successfully!";
    res.redirect("/admin/pens");
  } catch (err) {
    req.session.errorMsg = err.message;
    res.redirect("/admin/pens");
  }
};

exports.getPenDetails = async (req, res) => {
  try {
    const pen = await Pen.findById(req.params.penId).populate("brand");
    if (!pen) {
      return res.status(404).send("Pen not found");
    }
    const brands = await Brand.find();

    const successMsg = req.session.successMsg || null;
    const errorMsg = req.session.errorMsg || null;

    delete req.session.successMsg;
    delete req.session.errorMsg;

    res.render("detail", {
      pen,
      brands,
      user: req.session.currentUser,
      successMsg,
      errorMsg,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

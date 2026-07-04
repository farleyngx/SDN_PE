const Pen = require("../../models/Pen");
const Brand = require("../../models/Brand");

exports.getPenListView = async (req, res) => {
  try {
    const pens = await Pen.find().populate("brand");
    const brands = await Brand.find();
    res.render("pens", {
      pens,
      brands,
      user: req.session.currentUser,
      successMsg: req.query.success || null,
      errorMsg: req.query.error || null,
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
      return res.redirect(
        "/admin/pens?error=Pen name must contain only letters and space!",
      );
    }
    if (await Pen.findOne({ penName })) {
      return res.redirect("/admin/pens?error=Pen name already exists!");
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

    res.redirect("/admin/pens?success=Pen added successfully!");
  } catch (err) {
    res.redirect(`/admin/pens?error=${encodeURIComponent(err.message)}`);
  }
};

exports.updatePen = async (req, res) => {
  try {
    const { penName, penDescription, image, pouch, off, gender, brand } =
      req.body;

    if (!/^[A-Za-z\s]+$/.test(penName)) {
      return res.redirect(
        "/admin/pens?error=Pen name must contain only letters and space!",
      );
    }
    if (await Pen.findOne({ penName, _id: { $ne: req.params.penId } })) {
      return res.redirect("/admin/pens?error=Pen name already exists!");
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
    res.redirect("/admin/pens?success=Pen updated successfully!");
  } catch (err) {
    res.redirect(`/admin/pens?error=${encodeURIComponent(err.message)}`);
  }
};

exports.deletePen = async (req, res) => {
  try {
    await Pen.findByIdAndDelete(req.params.penId);
    res.redirect("/admin/pens?success=Pen deleted successfully!");
  } catch (err) {
    res.redirect(`/admin/pens?error=${encodeURIComponent(err.message)}`);
  }
};

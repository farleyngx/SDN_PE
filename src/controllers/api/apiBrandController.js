const Brand = require("../../models/Brand");
const Pen = require("../../models/Pen");

exports.getAllBrands = async (req, res) => {
  try {
    res.json(await Brand.find());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    res.status(201).json(await new Brand(req.body).save());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Brand not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const associatedPen = await Pen.findOne({ brand: req.params.id });
    if (associatedPen) {
      return res
        .status(400)
        .json({
          message: "Cannot delete brand because it has associated pens",
        });
    }

    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand)
      return res.status(404).json({ message: "Brand not found" });
    res.json({ message: "Brand deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

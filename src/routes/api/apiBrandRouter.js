const express = require("express");
const router = express.Router();
const apiBrandController = require("../../controllers/api/apiBrandController");
const verifyJWT = require("../../middlewares/authAPI");

router.use(verifyJWT);
router
  .route("/")
  .get(apiBrandController.getAllBrands)
  .post(apiBrandController.createBrand);
router
  .route("/:id")
  .get(apiBrandController.getBrandById)
  .put(apiBrandController.updateBrand)
  .delete(apiBrandController.deleteBrand);
module.exports = router;

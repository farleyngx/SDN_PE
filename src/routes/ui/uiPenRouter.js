const express = require("express");
const router = express.Router();
const uiPenController = require("../../controllers/ui/uiPenController");
const verifyUIAuth = require("../../middlewares/authUI");

router.use(verifyUIAuth);
router
  .route("/")
  .get(uiPenController.getPenListView)
  .post(uiPenController.addPen);
router
  .route("/:penId")
  .put(uiPenController.updatePen)
  .delete(uiPenController.deletePen);
module.exports = router;

const express = require("express");
const router = express.Router();
const uiAuthController = require("../../controllers/ui/uiAuthController");

router.get("/access", uiAuthController.getLoginView);
router.post("/access", uiAuthController.handleLogin);
router.get("/logout", uiAuthController.handleLogout);
module.exports = router;

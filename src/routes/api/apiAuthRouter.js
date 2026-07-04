const express = require("express");
const router = express.Router();
const apiAuthController = require("../../controllers/api/apiAuthController");

router.post("/tokens", apiAuthController.getTokens);
module.exports = router;

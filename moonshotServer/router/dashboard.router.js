const express = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();
const { dashboard } = require("../controller/dashboard.controller");

router.get("/", authenticateToken, dashboard);

module.exports = router;

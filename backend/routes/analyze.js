const express = require("express");
const { analyzeRepo } = require("../controllers/analyzeController");

const router = express.Router();

router.post("/", analyzeRepo);

module.exports = router;
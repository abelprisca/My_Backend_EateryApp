const express = require("express");

const router = express.Router();

const {
    getAnalytics
} = require("../controllers/adminAnalyticsController");


// =====================================
// ADMIN ANALYTICS
// =====================================

router.get(
    "/analytics",
    getAnalytics
);


module.exports = router;
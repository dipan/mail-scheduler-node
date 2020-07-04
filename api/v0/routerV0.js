const express = require('express');
const routerSchedule = require('./schedule/routerSchedule');

const routerV0 = express.Router();

routerV0.use("/schedule", routerSchedule);

module.exports = routerV0;
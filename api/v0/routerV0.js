const express = require('express');
const UserAuthenticator = require('../../utility/UserAuthenticator');
const Utility = require('../../utility/Utility');
const Logger = require('../../com/Logger');
const ResponseStatus = require('../ResponseStatus');
const routerSchedule = require('./schedule/routerSchedule');

const routerV0 = express.Router();

routerV0.use("/schedule", routerSchedule);

module.exports = routerV0;
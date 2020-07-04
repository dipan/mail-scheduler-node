const express = require('express');
const routerV0 = require('./v0/routerV0');

const routerApi = express.Router();

routerApi.use("/v0", routerV0);

module.exports = routerApi;
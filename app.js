const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const ResponseStatus = require('./api/ResponseStatus');
const Logger = require('./com/Logger');


const routerApi = require('./api/routerApi');
const AgendaUtil = require('./lib/AgendaUtil');

const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT;

AgendaUtil.initializeMailing();

app.use("/", (req, res, next) => {
    Logger.info(getRequestObject(req));

    next();
});

server.listen(port, () => {
    Logger.info(`${process.env.NODE_ENV} environment : HTTP server listening on port ${port}!`);
    Logger.info("http://localhost:4000");
});

app.use("/api", routerApi);

function getRequestObject(req) {
    let logObject = {};
    logObject["version"] = req.httpVersion;
    logObject["majorVersion"] = req.httpVersionMajor;
    logObject["minorVersion"] = req.httpVersionMinor;
    logObject["method"] = req.method;
    logObject["originalURL"] = req.originalUrl;
    logObject["baseURL"] = req.baseUrl;
    logObject["url"] = req.url;
    logObject["headers"] = req.headers;
    logObject["params"] = req.params;
    logObject["query"] = req.query;
    logObject["body"] = req.body;

    return logObject;
}
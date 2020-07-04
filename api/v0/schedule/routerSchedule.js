const express = require('express');
const ResponseStatus = require('../../ResponseStatus');
const Logger = require('../../../com/Logger');
const PutSchedule = require('./PutSchedule');
const DeleteSchedule = require('./DeleteSchedule');

const routerSchedule = express.Router();

const PostSchedule = require('./PostSchedule');
const GetSchedule = require('./GetSchedule');

routerSchedule.route("/")
    .post(async (req, res) => {
        let apiResponse = null;
        try {
            apiResponse = await new PostSchedule().execute(req);
        } catch (error) {
            Logger.error(error);
            apiResponse = ResponseStatus.INTERNAL_SERVER_ERROR(error);
        } finally {
            res.status(apiResponse.statusCode).send(apiResponse.message);
        }
    })
    .get(async (req, res) => {
        let apiResponse = null;
        try {
            apiResponse = await new GetSchedule().execute(req);
        } catch (error) {
            Logger.error(error);
            apiResponse = ResponseStatus.INTERNAL_SERVER_ERROR(error);
        } finally {
            res.status(apiResponse.statusCode).send(apiResponse.message);
        }
    });

routerSchedule.route("/:scheduleId")
    .delete(async (req, res) => {
        let apiResponse = null;
        try {
            apiResponse = await new DeleteSchedule().execute(req);
        } catch (error) {
            Logger.error(error);
            apiResponse = ResponseStatus.INTERNAL_SERVER_ERROR(error);
        } finally {
            res.status(apiResponse.statusCode).send(apiResponse.message);
        }
    })
    .put(async (req, res) => {
        let apiResponse = null;
        try {
            apiResponse = await new PutSchedule().execute(req);
        } catch (error) {
            Logger.error(error);
            apiResponse = ResponseStatus.INTERNAL_SERVER_ERROR(error);
        } finally {
            res.status(apiResponse.statusCode).send(apiResponse.message);
        }
    });

module.exports = routerSchedule;
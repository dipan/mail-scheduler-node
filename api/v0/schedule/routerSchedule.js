const express = require('express');
const ResponseStatus = require('../../ResponseStatus');
const Logger = require('../../../com/Logger');
const GetUserById = require('./GetScheduleById');
const PatchUserIdPrivilege = require('./PatchUserIdPrivilege');
const PutUser = require('./PutSchedule');

const routerSchedule = express.Router();

const PostUser = require('./PostSchedule');
const GetUser = require('./GetSchedule');

routerSchedule.route("/")
    .post(async (req, res) => {
        let apiResponse = null;
        try {
            apiResponse = await new PostUser().execute(req);
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
            apiResponse = await new GetUser().execute(req);
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
            apiResponse = await new GetUserById().execute(req);
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
            apiResponse = await new PutUser().execute(req);
        } catch (error) {
            Logger.error(error);
            apiResponse = ResponseStatus.INTERNAL_SERVER_ERROR(error);
        } finally {
            res.status(apiResponse.statusCode).send(apiResponse.message);
        }
    });

module.exports = routerSchedule;
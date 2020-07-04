const uuidv5 = require('uuid/v5');
const moment = require('moment');
const ResponseStatus = require('../../ResponseStatus');
const Logger = require('../../../com/Logger');
const DbUtility = require('../../../utility/dbutility/DBUtility');

class PutSchedule {
    execute(parameters) {
        return new Promise(async (resolve, reject) => {
            try {
                let scheduleId = parameters.params.scheduleId;
                let body = parameters.body;

                // TODO code to update data to MongoDB
                DbUtility.updateData("schedule", scheduleId, body);
                AgendaUtil.scheduleMail(body.interval, body.jobName, body.data);

                let response = {};
                response["message"] = "User details updated successfully";
                resolve(ResponseStatus.OK(response));
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = PutSchedule;
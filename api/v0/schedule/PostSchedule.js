const ResponseStatus = require('../../ResponseStatus');
const Utility = require('../../../utility/Utility');
const Logger = require('../../../com/Logger');
const AgendaUtil = require('../../../lib/AgendaUtil');
const DbUtility = require('../../../utility/dbutility/DBUtility');

class PostSchedule {
    execute(parameters) {
        return new Promise(async (resolve, reject) => {
            try {
                let body = parameters.body;

                // TODO code to insert data to MongoDB
                DbUtility.insertData("schedule", body);
                AgendaUtil.scheduleMail(body.interval, body.jobName, body.data);

                let response = {};
                response["message"] = "Mail scheduled successfully";
                resolve(ResponseStatus.CREATED(response));
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = PostSchedule;
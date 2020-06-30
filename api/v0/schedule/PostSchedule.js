const uuidv5 = require('uuid/v5');
const moment = require('moment');
const ResponseStatus = require('../../ResponseStatus');
const DbUtility = require('../../../mysql/DBUtility');
const PostPerson = require('../person/PostPerson');
const Utility = require('../../../utility/Utility');
const { organizationName } = require('../../../lib/appconfig');
const NotificationUtility = require('../../../notification/NotificationUtility');
const Logger = require('../../../com/Logger');
const AgendaUtil = require('../../../lib/AgendaUtil');

class PostSchedule {
    execute(parameters) {
        return new Promise(async (resolve, reject) => {
            try {
                let body = parameters.body;

                // TODO code to insert data to MongoDB
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
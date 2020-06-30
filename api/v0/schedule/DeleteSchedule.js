const DbUtility = require('../../../mysql/DBUtility');
const ResponseStatus = require('../../ResponseStatus');
const AgendaUtil = require('../../../lib/AgendaUtil');

class GetSchedule {
    execute(parameters) {
        return new Promise((resolve, reject) => {
            let body = parameters.body;
            let scheduleId = parameters.params.scheduleId;
            // TODO code to delete data from MongoDB
            

            let response = {};
            response["message"] = "Schedule deleted successfully";
            resolve(ResponseStatus.OK(response));
        });
    }
}

module.exports = GetSchedule;
const ResponseStatus = require('../../ResponseStatus');
const AgendaUtil = require('../../../lib/AgendaUtil');
const DbUtility = require('../../../utility/dbutility/DBUtility');

class GetSchedule {
    execute(parameters) {
        return new Promise((resolve, reject) => {
            let body = parameters.body;
            let scheduleId = parameters.params.scheduleId;
            // TODO code to delete data from MongoDB
            DbUtility.deleteOne("schedule", scheduleId, body);

            let response = {};
            response["message"] = "Schedule deleted successfully";
            resolve(ResponseStatus.OK(response));
        });
    }
}

module.exports = GetSchedule;
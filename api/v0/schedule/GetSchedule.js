const ResponseStatus = require('../../ResponseStatus');
const DbUtility = require('../../../utility/dbutility/DBUtility');

class GetSchedule {
    execute(parameters) {
        return new Promise(async (resolve, reject) => {
            // TODO code to get data from MongoDB

            let response = await DbUtility.getData("schedule");
            response["schedule"] = ["TODO data fetched form mongo"];
            resolve(ResponseStatus.OK(response));
        });
    }
}

module.exports = GetSchedule;
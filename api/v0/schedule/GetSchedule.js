const DbUtility = require('../../../mysql/DBUtility');
const ResponseStatus = require('../../ResponseStatus');

class GetSchedule {
    execute(parameters) {
        return new Promise((resolve, reject) => {
            // TODO code to get data from MongoDB

            let response = {};
            response["schedule"] = ["TODO data fetched form mongo"];
            resolve(ResponseStatus.OK(response));
        });
    }
}

module.exports = GetSchedule;
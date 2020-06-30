const jwt = require('jsonwebtoken');
const { jwtKey, tokenExpMin } = require('../lib/auth-config');
const Logger = require('../com/Logger');
const ResponseStatus = require('../api/ResponseStatus');
const Utility = require('./Utility');

class UserAuthenticator {
    static generateToken(payload) {
        let signOptions = {
            issuer: "BlueHigh Innovations",
            subject: "API token for EMS",
            audience: "em",
            expiresIn: tokenExpMin * 60,
            algorithm: "HS256"
        };

        let token = jwt.sign(payload, jwtKey, signOptions);
        return token;
    }

    static authenticateToken(token) {
        let varifyOptions = {
            issuer: "BlueHigh Innovations",
            subject: "API token for EMS",
            audience: "em",
            algorithm: "HS256"
        };
        let decoded = jwt.verify(token, jwtKey, varifyOptions);
        // console.log("Decoded token : " + JSON.stringify(decoded, null, 2));
        return decoded;
    }

    static addUserDetails(req, res, next) {
        let token = req.headers.authorization;
        try {
            if (Utility.isStringEmptyOrUndefined(token)) {
                let responseStatus = ResponseStatus.NO_AUTHENTICATION_TOKEN();
                res.status(responseStatus.statusCode)
                    .send(responseStatus.message);
            } else {
                token = UserAuthenticator.authenticateToken(token.substring("Bearer ".length));
                req["userData"] = token;
                next();
            }
        } catch (error) {
            Logger.error(getRequestObject(req));
            Logger.error(error);
            let responseStatus;
            if (error.name === "JsonWebTokenError") {
                responseStatus = ResponseStatus.INVALID_AUTHENTICATION_TOKEN();
            } else if (error.name === "TokenExpiredError") {
                responseStatus = ResponseStatus.AUTHENTICATION_TOKEN_EXPIRED();
            } else {
                responseStatus = ResponseStatus.INTERNAL_SERVER_ERROR(error);
            }
            res.status(responseStatus.statusCode)
                .send(responseStatus.message);
        }
        next();
    }
}

module.exports = UserAuthenticator;
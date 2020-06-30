class ResponseStatus {
    static OK(response) {
        return {
            message: response,
            statusCode: 200
        }
    }

    static CREATED(response) {
        return {
            message: response,
            statusCode: 201
        }
    }

    // 400 - bad request status
    static BAD_REQUEST(userMessage) {
        return {
            message: {
                developerMessage: "Bad Request",
                userMessage: userMessage,
                errorCode: 400000
            },
            statusCode: 400
        }
    }

    static REQUIRED_PARAMETER_MISSING(missingParameterName) {
        return {
            message: {
                developerMessage: "The request was invalid",
                userMessage: "Required parameter is missing",
                errorCode: 400001,
                missingParameter: missingParameterName
            },
            statusCode: 400
        }
    }

    static REQUIRED_HEADER_PARAMETER_MISSING(missingParameterName) {
        return {
            message: {
                developerMessage: "The request was invalid",
                userMessage: "Required header parameter is missing",
                errorCode: 400002,
                missingParameter: missingParameterName
            },
            statusCode: 400
        }
    }

    static REQUIRED_QUERY_PARAMETER_MISSING(missingParameterName) {
        return {
            message: {
                developerMessage: "The request was invalid",
                userMessage: "Required query parameter is missing",
                errorCode: 400003,
                missingParameter: missingParameterName
            },
            statusCode: 400
        }
    }

    static REQUIRED_BODY_PARAMETER_MISSING(missingParameterName) {
        return {
            message: {
                developerMessage: "The request was invalid",
                userMessage: "Required body parameter is missing",
                errorCode: 400004,
                missingParameter: missingParameterName
            },
            statusCode: 400
        }
    }

    static INVALID_PARAMETER(userMessage) {
        return {
            message: {
                developerMessage: "Invalid parameter",
                userMessage: userMessage,
                errorCode: 400005
            },
            statusCode: 400
        }
    }

    static INVALID_PARAMETER_VALUE(paramName, validValues = []) {
        return {
            message: {
                developerMessage: "Invalid parameter value",
                userMessage: "Provided " + paramName + " is invalid",
                errorCode: 400006,
                validValues: validValues
            },
            statusCode: 400
        }
    }

    // unauthorized status
    static UNAUTHORIZED(userMessage) {
        return {
            message: {
                developerMessage: "User is unauthorized to access the resource",
                userMessage: userMessage,
                errorCode: 401000
            },
            statusCode: 401
        }
    }

    static NO_AUTHENTICATION_TOKEN() {
        return {
            message: {
                developerMessage: "No authentication token provided",
                userMessage: "Provide authentication token",
                errorCode: 401001
            },
            statusCode: 401
        }
    }

    static INVALID_AUTHENTICATION_TOKEN() {
        return {
            message: {
                developerMessage: "Invalid authentication token",
                userMessage: "Provide valid authentication token",
                errorCode: 401002
            },
            statusCode: 401
        }
    }

    static AUTHENTICATION_TOKEN_EXPIRED() {
        return {
            message: {
                developerMessage: "Authentication token expired",
                userMessage: "Provide new authentication token",
                errorCode: 401003
            },
            statusCode: 401
        }
    }

    // forbidden status
    static FORBIDDEN(userMessage) {
        return {
            message: {
                developerMessage: "User does not have the necessary permissions for the resource",
                userMessage: userMessage,
                errorCode: 403000
            },
            statusCode: 403
        }
    }

    // not found status
    static NOT_FOUND(userMessage) {
        return {
            message: {
                developerMessage: "Not found",
                userMessage: userMessage,
                errorCode: 404000
            },
            statusCode: 404
        }
    }

    static NO_DATA_AVAILABLE(userMessage) {
        return {
            message: {
                developerMessage: "No data available",
                userMessage: userMessage,
                errorCode: 404001
            },
            statusCode: 404
        }
    }

    static OBJECT_NOT_FOUND(objectType) {
        return {
            message: {
                developerMessage: "Object not found",
                userMessage: "Specified " + objectType + " not found",
                errorCode: 404002
            },
            statusCode: 404
        }
    }

    // conflict
    static CONFLICT(userMessage) {
        return {
            message: {
                developerMessage: "Conflict encountered",
                userMessage: userMessage,
                errorCode: 409000
            },
            statusCode: 409
        }
    }

    // internal server error status
    static INTERNAL_SERVER_ERROR(internalError) {
        return {
            message: {
                developerMessage: "Internal server error occurred",
                userMessage: internalError.message,
                errorCode: 500000,
                error: internalError
            },
            statusCode: 500
        }
    }
}

module.exports = ResponseStatus;

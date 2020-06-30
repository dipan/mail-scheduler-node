const mysql = require('mysql2');
const Logger = require('../../com/Logger');
const Utility = require('../Utility');
const connectionProperties = require('../../lib/connection-properties');
const ClientError = require('../../api/v0/common/error/ClientError');

class DBUtility {
    constructor() {
        this.host = connectionProperties.mysql.host;
        this.user = connectionProperties.mysql.user;
        this.password = connectionProperties.mysql.password;
        this.database = connectionProperties.mysql.database;
        this.connectionLimit = connectionProperties.mysql.connectionLimit;
        this.queueLimit = connectionProperties.mysql.queueLimit;
        this.pool = mysql.createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            waitForConnections: true,
            connectionLimit: 20,
            queueLimit: 100
        });
        this.dbUtility = undefined;
    }

    static getConnectionPool() {
        return DBUtility.getInstance().pool.promise();
    }

    static getInstance() {
        if (this.dbUtility === undefined) {
            this.dbUtility = new DBUtility();
        }
        return this.dbUtility;
    }

    static async getConnectionFromPool() {
        let dbUtility = DBUtility.getInstance();
        let poolPromise = this.getConnectionPool();

        return await poolPromise.getConnection();
    }

    static async getConnection(database) {
        let conn = mysql.createConnection({
            host: connectionProperties.mysql.host,
            user: connectionProperties.mysql.user,
            password: connectionProperties.mysql.password,
            database: database
        });
        return conn;
    }

    static getDataAsList(query, paramList = []) {
        return new Promise((resolve, reject) => {
            getMySQLConnection()
                .then((connection) => {
                    try {
                        let column = query.substring("SELECT".length, query.indexOf("FROM")).trim().split(",");
                        if (column.length != 1) {
                            throw new Error("Invalid query : getDataAsList() accepts query with single column");
                        }
                        connection.query(query, paramList, (error, results, fields) => {
                            query = this.getActualQuery(query, paramList);
                            if (error) {
                                Logger.error("Query falied : " + query);
                                reject(error);
                            } else {
                                let resultList = [];
                                for (let row of results) {
                                    resultList.push(row[fields[0].name]);
                                }
                                Logger.info("Query executed : " + query);
                                resolve(resultList);
                            }
                        });
                    } catch (error) {
                        reject(error);
                    } finally {
                        connection.release((error) => {
                            if (error) {
                                Logger.error('Error ending connection : ' + err.stack);
                            }
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static getDataAsKeyValuePair(query, paramList = []) {
        return new Promise((resolve, reject) => {
            getMySQLConnection()
                .then((connection) => {
                    try {
                        let columns = query.substring("SELECT".length, query.indexOf("FROM")).trim().split(",");
                        if (columns.length != 2) {
                            throw new Error("Invalid query : getDataAsKeyValuePair() accepts query with two columns");
                        }
                        connection.query(query, paramList, (error, results, fields) => {
                            query = this.getActualQuery(query, paramList);
                            if (error) {
                                Logger.error("Query falied : " + query);
                                reject(error);
                            } else {
                                let resultObject = {};
                                for (let row of results) {
                                    resultObject[row[fields[0].name]] = row[fields[1].name];
                                }
                                Logger.info("Query executed : " + query);
                                resolve(resultObject);
                            }
                        });
                    } catch (error) {
                        reject(error);
                    } finally {
                        connection.release((error) => {
                            if (error) {
                                Logger.error('Error ending connection : ' + err.stack);
                            }
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    static async getDataById(tableName, id, columns = "*") {
        let query = "SELECT " + columns + " FROM " + tableName + " WHERE id = ?";
        let paramList = [id];
        return await this.executeQuery(query, paramList);
    }

    static async getDataWithFilter(tableName, columns = "*", filter = "", sortBy = "", sortOrder = "ASC", offset = 0, limit = 1000) {
        offset = Number(offset);
        if (Number.isNaN(offset)) {
            throw new ClientError("Offset must be numeric");
        }
        limit = Number(limit);
        if (Number.isNaN(limit)) {
            throw new ClientError("Limit must be numeric");
        }

        let query = "SELECT " + columns + " FROM " + tableName + " ";
        let paramList = [];

        if (Utility.isStringNonEmpty(filter)) {
            let parsedFilter = this.getParsedFilter(filter);
            query += "WHERE " + parsedFilter.parsedFilter + " ";
            paramList.push(...parsedFilter.paramList);
        }

        if (Utility.isStringNonEmpty(sortBy)) {
            query += "ORDER BY " + tableName + "." + sortBy + " " + sortOrder.toUpperCase() + " ";
        }
        query += "LIMIT " + offset + ", " + limit;

        return await this.executeQuery(query, paramList);
    }

    static async executeQuery(query, paramList = []) {
        try {
            let [rows, fields] = await DBUtility.getConnectionPool().query(query, paramList);
            query = this.getActualQuery(query, paramList);
            Logger.info("Query executed : " + query);
            return rows;
        } catch (error) {
            query = this.getActualQuery(query, paramList);
            Logger.error("Query falied : " + query);
            throw error;
        }
    }

    static getTableMetadata(tableName) {
        return new Promise((resolve, reject) => {
            getMySQLConnection()
                .then((connection) => {
                    try {
                        let query = "SELECT * FROM " + tableName + " LIMIT 1";
                        connection.execute(query, [], (error, results, fields) => {
                            query = this.getActualQuery(query);
                            if (error) {
                                Logger.error("Query falied : " + query);
                                reject(error);
                            } else {
                                Logger.info("Query executed : " + query);
                                resolve(fields);
                            }
                            connection.release((error) => {
                                if (error) {
                                    Logger.error('Error ending connection : ' + err.stack);
                                }
                            });
                        });
                    } catch (error) {
                        Logger.error(error);
                        reject(error);
                    }
                })
                .catch((error) => {
                    Logger.error(error);
                    reject(error);
                });
        });
    }

    static getDataAndMetadata(query, paramList = []) {
        return new Promise((resolve, reject) => {
            getMySQLConnection()
                .then((connection) => {
                    try {
                        connection.query(query, paramList, (error, results, fields) => {
                            query = this.getActualQuery(query, paramList);
                            if (error) {
                                Logger.error("Query falied : " + query);
                                reject(error);
                            } else {
                                Logger.info("Query executed : " + query);
                                resolve([results, fields]);
                            }
                            connection.release((error) => {
                                if (error) {
                                    Logger.error('Error ending connection : ' + err.stack);
                                }
                            });
                        });
                    } catch (error) {
                        Logger.error(error);
                        reject(error);
                    }
                })
                .catch((error) => {
                    Logger.error(error);
                    reject(error);
                });
        });
    }

    static isIdExists(tableName, id) {
        return new Promise((resolve, reject) => {
            getMySQLConnection()
                .then((connection) => {
                    try {
                        let query = "SELECT id FROM " + tableName + " WHERE id = ?";
                        let paramList = [id];
                        connection.query(query, paramList, (error, results) => {
                            query = this.getActualQuery(query, paramList);
                            if (error) {
                                Logger.error("Query falied : " + query);
                                reject(error);
                            } else {
                                Logger.info("Query executed : " + query);
                                resolve(Boolean(results.length));
                            }
                            connection.release((error) => {
                                if (error) {
                                    Logger.error('Error ending connection : ' + err.stack);
                                }
                            });
                        });
                    } catch (error) {
                        Logger.error(error);
                        reject(error);
                    }
                })
                .catch((error) => {
                    Logger.error(error);
                    reject(error);
                });
        });
    }

    static executeTransactionalQuery(connection, query, paramList = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, paramList, (error, results) => {
                query = this.getActualQuery(query, paramList);
                if (error) {
                    Logger.error("Query falied : " + query);
                    reject(error);
                } else {
                    Logger.info("Query executed : " + query);
                    resolve(results);
                }
            });
        });
    }

    // Filter expression format : column co word1+word2 and/or column co word1+word2
    static getParsedFilter(filter) {
        filter = filter.trim();
        let parsedFilter = "";
        let parsedIndex = 0;
        let paramList = [];
        while (parsedIndex < filter.length) {
            let andIndex = filter.indexOf(" and ", parsedIndex);
            let orIndex = filter.indexOf(" or ", parsedIndex);
            let eachFilterExpn;
            let condition = "";
            if (andIndex > 0 && (orIndex === -1 || andIndex < orIndex)) {
                eachFilterExpn = filter.substring(parsedIndex, andIndex);
                condition = " and ";
                parsedIndex += eachFilterExpn.length + condition.length;
            } else if (orIndex > 0 && (andIndex === -1 || orIndex < andIndex)) {
                eachFilterExpn = filter.substring(parsedIndex, orIndex);
                condition = " or ";
                parsedIndex += eachFilterExpn.length + condition.length;
            } else {
                eachFilterExpn = filter.substring(parsedIndex, filter.length);
                parsedIndex += filter.length;
            }

            Logger.debug('eachFilterExpn: ', eachFilterExpn);
            eachFilterExpn = eachFilterExpn.split(" ");
            let clientError = new ClientError("Invalid filter expression : " +
                eachFilterExpn.toString().replace(/,/g, " "));
            if (eachFilterExpn.length !== 3) {
                throw clientError;
            }

            eachFilterExpn[2] = eachFilterExpn[2].replace(/\+/g, " ");
            switch (eachFilterExpn[1]) {
                case "co":  //contains
                    eachFilterExpn[0] = "UPPER(" + eachFilterExpn[0] + ")";
                    eachFilterExpn[1] = "LIKE";
                    paramList.push("%" + eachFilterExpn[2] + "%");
                    break;
                case "sw":  //starts with
                    eachFilterExpn[0] = "UPPER(" + eachFilterExpn[0] + ")";
                    eachFilterExpn[1] = "LIKE";
                    paramList.push(eachFilterExpn[2] + "%");
                    break;
                case "ew":  //ends with
                    eachFilterExpn[0] = "UPPER(" + eachFilterExpn[0] + ")";
                    eachFilterExpn[1] = "LIKE";
                    paramList.push("%" + eachFilterExpn[2]);
                    break;
                case "gt":
                    eachFilterExpn[1] = ">";
                    paramList.push(eachFilterExpn[2]);
                    break;
                case "ge":
                    eachFilterExpn[1] = ">=";
                    paramList.push(eachFilterExpn[2]);
                    break;
                case "lt":
                    eachFilterExpn[1] = "<";
                    paramList.push(eachFilterExpn[2]);
                    break;
                case "le": eachFilterExpn[1] = "<=";
                    paramList.push(eachFilterExpn[2]);
                    break;
                case "eq": eachFilterExpn[1] = "=";
                    paramList.push(eachFilterExpn[2]);
                    break;
                default: throw clientError;
            }
            eachFilterExpn[2] = "?";

            eachFilterExpn = eachFilterExpn.toString().replace(/,/g, " ").replace(/\+/g, " ");

            parsedFilter += eachFilterExpn + condition.toUpperCase();
        }
        let parsedData = {
            parsedFilter: parsedFilter,
            paramList: paramList
        };
        return parsedData;
    }

    static getActualQuery(query, paramList = []) {
        query = query.replace("\n", "");
        for (let eachParam of paramList) {
            if (typeof eachParam === "string") {
                eachParam = "'" + eachParam + "'";
            }
            query = query.replace("?", eachParam);
        }
        return query;
    }
}

module.exports = DBUtility;
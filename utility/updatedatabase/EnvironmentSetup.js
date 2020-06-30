const fs = require('fs');
const mysql = require('mysql2');
const uuidv5 = require('uuid/v5');
const moment = require('moment');
const Utility = require('../Utility');

function createDatabase() {
    const connectionProperties = require('../../lib/connection-properties');
    return new Promise((resolve, reject) => {
        try {
            let conn = mysql.createConnection({
                host: connectionProperties.mysql.host,
                user: connectionProperties.mysql.user,
                password: connectionProperties.mysql.password
            });
            console.log("Successfully connected to MySQL");
            conn.query("CREATE DATABASE " + connectionProperties.mysql.database, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(result);
                    console.log("Database " + connectionProperties.mysql.database + " created successfully");
                    resolve(result);
                }
                conn.end();
            });
        } catch (error) {
            console.error(error);
        }
    });
}

function copyConfigFiles() {
    let path = "lib";
    try {
        let files = Utility.getFilesList(path);
        for (let file of files) {
            let pattern = /\.sample\.js$/;  // string ends with '.sample.js'
            file = path + "/" + file;
            if (pattern.test(file)) {
                Utility.copyFile(file, file.replace(".sample.", "."));
                console.log(file + " copied to " + file.replace(".sample.", "."));
            }
        }
    } catch (error) {
        console.error(error);
    }
}

async function executeSQLStatements(fileName) {
    const DbUtility = require('../dbutility/DBUtility');
    if (Utility.isStringNonEmpty(fileName)) {
        let sqlStatements = fs.readFileSync("utility/updatedatabase/" + fileName)
            .toString()
            .split(";");
        for (i in sqlStatements) {
            let sql = sqlStatements[i].trim();
            try {
                if (sql != "") {
                    await DbUtility.executeQuery(sql)
                        .then((result) => {
                            console.log("Query result - " + JSON.stringify(result));
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            } catch (error) {
                console.error(error)
            }
        }
    } else {
        console.log("Please provide sql file name");
    }
}

switch (process.argv[2]) {
    case "databaseSetup": createDatabase().then((result) => {
        executeSQLStatements("expense-management.sql");
    }).catch((error) => {
        console.log(error);
    });
        break;
    case "copyConfigFiles": copyConfigFiles();
        break;
    case "executeSQLStatements": executeSQLStatements(process.argv[3]);
        break;
    default: console.log("Unknown command : " + process.argv[2]);
}
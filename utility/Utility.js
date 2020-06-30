const moment = require('moment');
const RandExp = require('randexp');
const fs = require('fs');
const Logger = require('../com/Logger');
const nodemailer = require('nodemailer');

class Utility {
    static isStringEmptyOrUndefined(value) {
        if (value === undefined || value === null) {
            return true
        }
        value = value.trim().toLowerCase();
        return value.length === 0 || value === "undefined";
    }

    static isStringNonEmpty(value) {
        if (value === undefined || value === null) {
            return false
        }
        value = value.trim().toLowerCase();
        return value.length !== 0 && value !== "undefined";
    }

    static isTrue(value) {
        let truePattern = /^((t(rue)?)|(y(es)?)|(\+?-?[1-9]+))$/i;
        return truePattern.test(String(value));
    }

    static generateOtp(noOfDigits = 6) {
        return (Math.random().toString().substr(2, noOfDigits));
    }

    static getMaskedString(value, start, end, maskCharacter = 'X') {
        let subStrLen = end - start;
        let reqRegex = new RegExp(maskCharacter + "{" + subStrLen + "}");
        return value.replace(value.substr(start, subStrLen), new RandExp(reqRegex).gen());
    }

    static getPlaceHolder(size) {
        let placeHolder = "";
        for (let i = 0; i < size; i++) {
            placeHolder += "?,";
        }
        return placeHolder.substring(0, placeHolder.length - 1);
    }

    static getFormattedDateTime(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
        return moment(timestamp).format(format);
    }

    static getFilesList(path) {
        return fs.readdirSync(path);
    }

    static copyFile(src, dest, mode = fs.constants.COPYFILE_EXCL) {
        return fs.copyFileSync(src, dest, mode);
    }

    static sendMail(recipients, subject, body, sender = "CloudKit Team <no-reply@cloudkit.com>") {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',//smtp.gmail.com  //in place of service use host...
            secure: true,//true
            port: 465,//465,25
            auth: {
                user: 'bluehigh.innovations@gmail.com',
                pass: 'developers@Bluehigh2019'
            }, tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: sender,
            to: recipients,
            subject: subject,
            html: body
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    Logger.error(error);
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
}

module.exports = Utility;

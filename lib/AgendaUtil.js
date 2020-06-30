const Agenda = require('agenda');

const mongoConnectionString = process.env.MONGO_CONN_STRING;

const agenda = new Agenda({ db: { address: mongoConnectionString } });

class AgendaUtil {
    static initializeMailing() {
        agenda.define('send email', { concurrency: 10 }, async (job) => {
            const { to, from, subject, body } = job.attrs.data;
            await emailClient.send({
                to,
                from,
                subject,
                body
            });
        });
    }

    static async scheduleMail(interval, jobName, data) {
        await agenda.every(interval, jobName, data);
    }
}

module.exports = AgendaUtil;
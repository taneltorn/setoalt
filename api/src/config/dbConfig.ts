import {Pool} from 'pg';
import log4js from "log4js";
import * as process from "process";
import {config} from 'dotenv';
import * as path from 'path';
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

config({path: path.resolve(__dirname, '../../../.env')});

logger.info("Creating database pool");
logger.info(`host: ${process.env.DB_HOST}`);
logger.info(`database: ${process.env.DB_NAME}`);
logger.info(`user: ${process.env.DB_USER}`);
logger.info(`port: ${process.env.DB_PORT}`);

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
});

const testConnection = async (maxRetries = 10, delay = 2000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const client = await pool.connect();
            logger.info('Connected to database successfully');

            const res = await client.query('SELECT NOW()');
            logger.info('Current time from database:', res.rows[0].now);

            client.release();
            return;
        } catch (err) {
            logger.error(`Attempt ${attempt}: Failed to connect to database - ${err.message}`);
            if (attempt === maxRetries) {
                throw new Error('Max retries reached. Giving up on connecting to the database.');
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

testConnection().catch(err => {
    logger.error(err.message);
    process.exit(1);
});

export default pool;
import {Pool} from 'pg';
import log4js from "log4js";
import * as process from "process";
import {config} from 'dotenv';
import * as path from 'path';
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

config({path: path.resolve(__dirname, '../../../.env')});

logger.info("Creating database pool");
logger.info(`host: ${process.env.POSTGRES_HOST}`);
logger.info(`database: ${process.env.POSTGRES_DB}`);
logger.info(`user: ${process.env.POSTGRES_USER}`);
logger.info(`port: ${process.env.POSTGRES_PORT}`);


const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

const testConnection = async (maxRetries = 5, delay = 2000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const client = await pool.connect();
            logger.info('Connected to database successfully');

            const res = await client.query('SELECT NOW()');
            logger.info('Current time from DB:', res.rows[0].now);

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
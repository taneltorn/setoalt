import { Pool } from 'pg';
import { config } from 'dotenv';
import * as path from 'path';
import log4js from "log4js";
import * as process from "process";

config({ path: path.resolve(__dirname, '../../../.env') });

const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

logger.info("Creating database pool");
logger.info(`host: ${process.env.POSTGRES_HOST}`);
logger.info(`database: ${process.env.POSTGRES_DB}`);
logger.info(`user: ${process.env.POSTGRES_USER}`);
logger.info(`port: ${process.env.POSTGRES_PORT}`);


export const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

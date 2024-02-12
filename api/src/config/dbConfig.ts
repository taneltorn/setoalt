import { Pool } from 'pg';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(__dirname, '../../../.env') });

console.log("Creating new database pool");
console.log(`host: ${process.env.POSTGRES_HOST}`);
console.log(`database: ${process.env.POSTGRES_DB}`);
console.log(`user: ${process.env.POSTGRES_USER}`);
console.log(`port: ${process.env.POSTGRES_PORT}`);


export const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
});

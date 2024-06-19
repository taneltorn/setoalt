import pool from "../config/dbConfig";
import log4js from "log4js";
import Mapper from "../utils/Mapper";

class UserService {
    private logger = log4js.getLogger("UserService");

    constructor() {
        this.logger.level = process.env.LOG_LEVEL;
    }

    public async findAll() {
        try {
            this.logger.info(`Querying users`);
            const query = `
                SELECT *
                FROM setoalt.users
                WHERE deleted_at IS NULL
                ORDER BY id ASC
            `;
            const result = await pool.query(query);

            this.logger.info(`Found ${result.rows.length} row(s)`);
            return {success: true, data: Mapper.mapFields(result.rows)};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: "Error querying users", detail: err.detail};
        }
    }

    public async findByUsername(username: string): Promise<any> {
        try {
            this.logger.info(`Querying user with username = ${username}`);

            const query = "SELECT * FROM setoalt.users WHERE username = $1 AND deleted_at IS NULL";
            const result = await pool.query(query, [username]);

            this.logger.info(`Found ${result.rows.length} row(s)`);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: Mapper.mapFields(result.rows[0])};

        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error querying user with username = ${username}`, detail: err.detail};
        }
    }

    public async insert(data: any, user: any) {
        try {
            this.logger.info(`Inserting new user`);
            const query = `
                INSERT INTO setoalt.users(username, password, firstname, lastname, role, created_by, deleted_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
            `;
            const result = await pool.query(query, [
                data.username,
                data.password,
                data.firstname,
                data.lastname,
                data.role,
                user.username,
                null,
            ]);

            this.logger.info(`Inserted ${result.rowCount} row(s)`);
            return {success: true, data: result.rows[0]};
        } catch (err) {
            if (err.code === '23505') {
                this.logger.info("Duplicate username");
                return {success: false, error: "Duplicate username"};
            }
            this.logger.error(err);
            return {success: false, error: "Error inserting user", detail: err.detail};
        }
    }

    public async update(id: number, data: any, user: any) {
        try {
            this.logger.info(`Updating user with id = ${id}`);
            const query = `
                UPDATE setoalt.users
                SET firstname   = $1,
                    lastname    = $2,
                    role        = $3,
                    modified_by = $4,
                    modified_at = NOW()
                WHERE id = $5
                RETURNING *;
            `;

            const result = await pool.query(query, [
                data.firstname,
                data.lastname,
                data.role,
                user.username,
                id
            ]);

            this.logger.info(`Updated ${result.rowCount} row(s)`);
            return {success: true, data: result.rows[0]};
        } catch (err) {
            if (err.code === '23505') {
                this.logger.info("Duplicate username");
                return {success: false, error: "Duplicate username"};
            }
            this.logger.error(err);
            return {success: false, error: `Error updating user with id ${id}`, detail: err.detail};
        }
    }

    public async delete(id: number) {
        try {
            this.logger.info(`Deleting user with id = ${id}`);

            // todo implement soft delete
            const query = "DELETE FROM setoalt.users WHERE id = $1 RETURNING id";
            const result = await pool.query(query, [id]);

            this.logger.info(`Deleted ${result.rows} row(s)`);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: result.rows[0]};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error deleting user with id = ${id}`, detail: err.detail};
        }
    }
}

export default new UserService();

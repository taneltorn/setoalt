import {pool} from "../config/dbConfig";
import {mapFields} from "../utils/helpers";
import log4js from "log4js";

class UserService {
    private logger = log4js.getLogger("UserService");

    constructor() {
        this.logger.level = 'info';
    }

    public async findAllUsers() {
        try {
            this.logger.info(`Querying users`);
            const query = `
                SELECT *
                FROM setoalt.users
                WHERE deleted_at IS NULL
                  AND role != 'ADMIN'
            `;
            const result = await pool.query(query);

            this.logger.info(`Found ${result.rows.length} row(s)`);
            return {success: true, data: mapFields(result.rows)};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: "Error querying users", detail: err.detail};
        }
    }

    public async insertUser(data: any, user: any) {
        try {
            this.logger.info(`Inserting new user`);
            const query = `
                INSERT INTO setoalt.users(username, password, role, created_by, deleted_at)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const result = await pool.query(query, [
                data.username,
                data.password,
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

    public async deleteUser(id: number) {
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

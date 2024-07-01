import pool from "../config/dbConfig";
import log4js from "log4js";
import Mapper from "../utils/Mapper";

class ScoreService {
    private logger = log4js.getLogger("ScoreService");

    constructor() {
        this.logger.level = process.env.LOG_LEVEL;
    }

    public async find(username?: string): Promise<any> {
        try {
            this.logger.info(`Fetching scores`);

            let query = `SELECT *
                         FROM setoalt.scores
                         WHERE deleted_at IS NULL`;
            query += username ? ` AND (created_by = '${username}' OR visibility = 'PUBLIC')` : "";
            query += ` ORDER BY name ASC`;

            const result = await pool.query(query);

            this.logger.info(`Found ${result.rows.length} ${result.rows.length === 1 ? "row" : "rows"}`);
            return {success: true, data: Mapper.mapFields(result.rows)};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: "Error querying scores", detail: err.detail};
        }
    }

    public async findById(id: number, username?: string): Promise<any> {
        try {
            this.logger.info(`Fetching score with id = ${id}`);

            let query = "SELECT * FROM setoalt.scores WHERE id = $1 AND deleted_at IS NULL";
            query += username ? ` AND (created_by = '${username}' OR visibility = 'PUBLIC')` : "";

            const result = await pool.query(query, [id]);

            this.logger.info(`Found ${result.rows.length} ${result.rows.length === 1 ? "row" : "rows"}`);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: Mapper.mapFields(result.rows[0])};

        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error querying score with id = ${id}`, detail: err.detail};
        }
    }

    public async insert(score: any, user: any): Promise<any> {
        try {
            this.logger.info(`Inserting new score`);
            const query = `INSERT INTO setoalt.scores(name, description, data, default_tempo, default_transposition,
                                                      text, visibility,
                                                      created_by,
                                                      deleted_at)
                           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                           RETURNING *`;
            const result = await pool.query(query, [
                score.name,
                score.description,
                score.data,
                score.defaultTempo,
                score.defaultTransposition,
                score.text,
                score.visibility,
                user.username,
                null,
            ]);
            this.logger.info(`Inserted ${result.rowCount} ${result.rowCount === 1 ? "row" : "rows"} `);
            return {success: true, data: result.rows[0]};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error inserting score`, detail: err.detail};
        }
    }

    public async update(id: number, score: any, user: any): Promise<any> {
        try {
            this.logger.info(`Updating score with id = ${id}`);

            const query = `
                UPDATE setoalt.scores
                SET name                  = $1,
                    description           = $2,
                    data                  = $3,
                    default_tempo         = $4,
                    default_transposition = $5,
                    text                  = $6,
                    visibility            = $7,
                    modified_by           = $8,
                    modified_at           = NOW()
                WHERE id = $9
                RETURNING *;
            `;
            const result = await pool.query(query, [
                score.name,
                score.description,
                score.data,
                score.defaultTempo,
                score.defaultTransposition,
                score.text,
                score.visibility,
                user.username,
                id,
            ]);
            this.logger.info(`Updated ${result.rowCount} ${result.rowCount ? "row" : "rows"}`);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: result.rows[0]};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error updating score with id ${id}`, detail: err.detail};
        }
    }

    public async delete(id: number, user: any): Promise<any> {
        try {
            this.logger.info(`Deleting score with id = ${id}`);

            const query = `
                UPDATE setoalt.scores
                SET deleted_by = $1,
                    deleted_at = NOW()
                WHERE id = $2
                RETURNING *;
            `;
            const result = await pool.query(query, [
                user.username,
                id,
            ]);
            this.logger.info(`Deleted ${result.rowCount} ${result.rowCount ? "row" : "rows"}`);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: result.rows[0]};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error deleting score with id ${id}`, detail: err.detail};
        }

        // try {
        //     this.logger.info(`Deleting score with id = ${id}`);
        //
        //     // TODO: Implement soft delete
        //     const query = "UPDATE setoalt.scores SET deleted_at WHERE id = $1 RETURNING id";
        //     const result = await pool.query(query, [id]);
        //     if (result.rows.length === 0) {
        //         return {success: false, error: "Not found"};
        //     }
        //     this.logger.info(`Deleted ${result.rows.length} ${result.rows.length === 1 ? "row" : "rows"}`);
        //     return {success: true, data: result.rows[0]};
        // } catch (err) {
        //     this.logger.error(err);
        //     return {success: false, error: `Error deleting score with id ${id}`, detail: err.detail};
        // }
    }
}

export default new ScoreService();

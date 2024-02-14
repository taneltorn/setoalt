import {pool} from "../config/dbConfig";
import log4js from "log4js";
import Mapper from "../utils/Mapper";


class ScoreService {
    private logger = log4js.getLogger("ScoreService");

    constructor() {
        this.logger.level = 'info';
    }

    public async findAllScores(user: any): Promise<any> {
        try {
            this.logger.info(`Querying scores`);

            let query = `SELECT *
                         FROM setoalt.scores
                         WHERE deleted_at IS NULL`;
            query += user ? ` AND (created_by = '${user.username}' OR visibility = 'PUBLIC')` : ` AND visibility = 'PUBLIC'`;
            query += ` ORDER BY name ASC`;

            const result = await pool.query(query);

            this.logger.info(`Found ${result.rows.length} row(s)`);
            return {success: true, data: Mapper.mapFields(result.rows)};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: "Error querying scores", detail: err.detail};
        }
    }

    public async findScoreById(id: number): Promise<any> {
        try {
            this.logger.info(`Querying score with id = ${id}`);

            const query = "SELECT * FROM setoalt.scores WHERE id = $1 AND deleted_at IS NULL";
            const result = await pool.query(query, [id]);

            this.logger.info(`Found ${result.rows.length} row(s)`);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: Mapper.mapFields(result.rows[0])};

        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error querying score with id = ${id}`, detail: err.detail};
        }
    }

    public async insertScore(score: any, user: any): Promise<any> {
        try {
            this.logger.info(`Inserting new score`);
            const query = `INSERT INTO setoalt.scores(name, description, data, default_tempo, text, visibility,
                                                      created_by,
                                                      deleted_at)
                           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                           RETURNING *`;
            const result = await pool.query(query, [
                score.name,
                score.description,
                score.data,
                score.defaultTempo,
                score.text,
                score.visibility,
                user.username,
                null,
            ]);
            this.logger.info(`Inserted ${result.rowCount} row(s)`);
            return {success: true, data: result.rows[0]};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error inserting score`, detail: err.detail};
        }
    }

    public async updateScore(id: number, updatedScore: any, user: any): Promise<any> {
        try {
            this.logger.info(`Updating score with id = ${id}`);

            const query = `
                UPDATE setoalt.scores
                SET name          = $1,
                    description   = $2,
                    data          = $3,
                    default_tempo = $4,
                    text          = $5,
                    visibility    = $6,
                    modified_by   = $7,
                    modified_at   = NOW()
                WHERE id = $8
                RETURNING *;
            `;
            const result = await pool.query(query, [
                updatedScore.name,
                updatedScore.description,
                updatedScore.data,
                updatedScore.defaultTempo,
                updatedScore.text,
                updatedScore.visibility,
                user.username,
                id,
            ]);
            this.logger.info(`Updated ${result.rowCount} row(s)`);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: result.rows[0]};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error updating score with id ${id}`, detail: err.detail};
        }
    }

    public async deleteScore(id: number): Promise<any> {
        try {
            this.logger.info(`Deleting score with id = ${id}`);

            // TODO: Implement soft delete
            const query = "DELETE FROM setoalt.scores WHERE id = $1 RETURNING id";
            const result = await pool.query(query, [id]);
            if (result.rows.length === 0) {
                return {success: false, error: "Not found"};
            }
            return {success: true, data: result.rows[0]};
        } catch (err) {
            this.logger.error(err);
            return {success: false, error: `Error deleting score with id ${id}`, detail: err.detail};
        }
    }
}

export default new ScoreService();

import express, {Request, Response} from 'express';
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

const Pool = require('pg').Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
    // host: 'localhost',
    // database: 'setoalt',
    // user: 'postgres',
    // password: 'postgres',
    // port: 5432,
});

app.get('/api/scores', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM setoalt.scores');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.get('/api/scores/:id', async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({error: 'Invalid ID'});
        return;
    }

    try {
        const result = await pool.query('SELECT * FROM setoalt.scores WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            res.status(404).json({error: 'Score not found'});
            return;
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

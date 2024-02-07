import express, {Request, Response} from 'express';
import {pool} from '../config/dbConfig';

const router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM setoalt.scores');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
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

export default router;
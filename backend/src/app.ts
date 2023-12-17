import express from 'express';

import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const port = 4000;

app.use(cors());

app.get('/hello', (req, res) => {
    res.send('Hello World!');

});

app.get('/scores/:id', (req, res) => {
    try {
        setTimeout(() => {
            const file = path.resolve(__dirname, `../examples/${req.params.id}.json`);
            if (!fs.existsSync(file)) {
                res.status(404).send("Score does not exist");
                return;
            }
            const data = fs.readFileSync(file, 'utf8');
            res.json(JSON.parse(data));
        }, 500);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

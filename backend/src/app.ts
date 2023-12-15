import express from 'express';

const app = express();
const port = 4000;

const cors = require('cors');
app.use(cors());

const fs = require('fs');

app.get('/hello', (req, res) => {
    res.send('Hello World!');

});

app.get('/score', (req, res) => {
    console.log("got request")

    try {
        console.log(__dirname)
        const data = fs.readFileSync('/examples/songs/pollulaul.json', 'utf8');
        console.log(data)
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (err) {
        console.log(err)
        res.status(500).send('Error reading the file');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

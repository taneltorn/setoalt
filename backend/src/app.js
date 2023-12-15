"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 4000;
const cors = require('cors');
app.use(cors());
const fs = require('fs');
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
app.get('/score', (req, res) => {
    console.log("got request");
    try {
        const data = fs.readFileSync('/examples/songs/pollulaul.json', 'utf8');
        console.log(data);
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    }
    catch (err) {
        res.status(500).send('Error reading the file');
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

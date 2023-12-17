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
const path = require("path");
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
app.get('/scores/pollulaul', (req, res) => {
    try {
        setTimeout(() => {
            const file = path.resolve(__dirname, '../examples/polluxlaul.json');
            console.log("file");
            console.log("file");
            console.log(file);
            const data = fs.readFileSync(file, 'utf8');
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        }, 500);
    }
    catch (err) {
        console.log("GOT ERROR");
        res.status(500).send('Error reading the file');
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

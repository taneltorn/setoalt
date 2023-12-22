"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});
app.get('/scores/:id', (req, res) => {
    try {
        setTimeout(() => {
            const file = path_1.default.resolve(__dirname, `../examples/${req.params.id}.json`);
            if (!fs_1.default.existsSync(file)) {
                res.status(404).send("Score does not exist");
                return;
            }
            const data = fs_1.default.readFileSync(file, 'utf8');
            res.json(JSON.parse(data));
        }, 500);
    }
    catch (err) {
        res.status(500).send('Server error');
    }
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
client
    .connect()
    .then(() => {
    console.log("Connected to Redis");
})
    .catch((err) => {
    console.error("Could not connect to Redis:", err);
});
app.post("/submit", (req, res) => {
    const { problemId, userId, code, language } = req.body;
    client
        .lPush("submissions", JSON.stringify({ problemId, userId, code, language }))
        .then(() => {
        res.json({ message: "Submission received" });
    })
        .catch((err) => {
        console.error("Error pushing to Redis:", err);
        res.status(500).json({ message: "Internal server error" });
    });
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();

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

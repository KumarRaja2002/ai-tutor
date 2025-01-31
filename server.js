require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [{ role: "system", content: "You are a friendly Python tutor for kids." }, { role: "user", content: message }],
            },
            { headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" } }
        );
        res.json(response.data.choices[0].message.content);
    } catch (error) {
        res.status(500).json({ error: "Error connecting to AI API" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

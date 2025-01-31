require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;  // Store the API key in .env

// Define the route to interact with Gemini API
app.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        // Making the POST request to Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, // Gemini API endpoint
            {
                contents: [
                    {
                        parts: [
                            { text: message || "Explain how AI works" } // Default message if no message is provided
                        ]
                    }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json" // Set the content type as JSON
                }
            }
        );
        const aiResponse = response.data.candidates[0].content.parts[0].text;

        // Send the AI response back to the frontend
        res.json({ response: aiResponse });
    } catch (error) {
        // Handle errors and provide meaningful messages
        res.status(500).json({
            error: "Error connecting to Gemini API",
            details: error.response ? error.response.data : error.message,
        });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

const express = require('express');
const cors = require('cors');
const { Client } = require('@gradio/client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        console.log(`Connecting to HF Space... Message: ${message}`);
        
        // Check if HF_TOKEN is valid
        if (!process.env.HF_TOKEN || process.env.HF_TOKEN.includes('your_huggingface_token_here')) {
            console.log('Skipping HuggingFace prediction. HF_TOKEN is not configured properly.');
            return res.json({ 
                response: "Hello from ChatPot! It looks like you haven't configured your Hugging Face API Token in the `backend/.env` file yet.\n\nSince this Space strictly requires an OAuth/Hugging Face Login, please obtain your token from `huggingface.co/settings/tokens` and add it to the `.env` file to chat with the real model!"
            });
        }

        const clientOptions = { hf_token: process.env.HF_TOKEN };
        console.log('Using provided HF_TOKEN');
        
        const client = await Client.connect("RaniGowda/ChatPot", clientOptions);
        
        console.log('Sending prediction request...');
        // The /respond endpoint maps to components: message, history, system_message, max_new_tokens, temperature, top_p
        const result = await client.predict("/respond", [
            message,
            history || [],
            "You are a friendly Chatbot.", // System message
            512, // max_new_tokens
            0.7, // temperature
            0.95 // top_p
        ]);

        console.log('Got result:', JSON.stringify({ dataLength: result.data.length }));
        
        // result.data is an array of outputs.
        // based on the space config, outputs for 'respond' are: [16 (json), 17 (state)] or something else?
        // Wait, the output of /respond is probably a string or the updated history.
        // Let's return the whole result data for now so we can parse it in the frontend if needed,
        // or just send back a success and we'll see the shape.
        
        res.json({ response: result.data });
    } catch (error) {
        console.error("Error communicating with HuggingFace Space:");
        console.error(error);
        const errorMsg = error.message || 'Failed to communicate with HuggingFace Space.';
        res.status(500).json({ error: errorMsg });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});

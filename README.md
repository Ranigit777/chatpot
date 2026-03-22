# ChatPot App

A modern, full-stack chatbot application that interfaces with the **RaniGowda/ChatPot** Hugging Face space.

## Features
- **Frontend**: A stunning, responsive UI featuring glassmorphism, smooth animations, dynamic dark mode styling, and an intuitive layout. Built with vanilla HTML/CSS/JS.
- **Backend**: A Node.js and Express server that proxies requests securely to the Hugging Face Inference space using `@gradio/client`. 

## Prerequisites
- Node.js (v18+)

## Setup

1. **Environment Variables**:
   Since the `RaniGowda/ChatPot` Gradio Space may require authentication to access the API endpoints, you must provide your Hugging Face API Token.
   - Navigate to the `backend/` folder.
   - Rename `.env.example` to `.env`.
   - Add your Hugging Face Token: `HF_TOKEN=hf_your_token_here`

2. **Run The Application**:
   - Double-click the `start.bat` script located in this folder.
   - The script will automatically install backend dependencies, start the backend server, and open the frontend UI in your browser.

## Tech Stack
- Client logic: `Vanilla JavaScript`
- Interface Styling: `CSS3 (Flexbox, Variables, Glassmorphism)` 
- Server: `Node.js + Express + CORS`
- Model Integration: `@gradio/client`

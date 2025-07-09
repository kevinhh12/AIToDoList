import e from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";



const chat_router = e.Router();

const backendURL = process.env.BACKEND_URL;


// Fetch your API_KEY
const API_KEY = process.env.GEMINI_AI_API;
// Reminder: This should only be for local testing

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

chat_router.post('/chat', async (req, res) => {
    const {username, message } = req.body;
  
    try {
      // Fetch the user's todo list
      const todo = await axios.get(`${backendURL}/toDo/internal-get/${username}`);
      const todoListString = JSON.stringify(todo.data, null, 2);

      // System prompt for the AI
      const systemPrompt = ` 
You are an assistant for a todo app.

You MUST respond with a single valid JSON object like this:

{
  "command": { ... },
  "text": "..." 
}

DO NOT wrap the JSON inside a string.
DO NOT return JSON as a code block or inside markdown.
DO NOT include any explanation or formatting outside the JSON.

Respond ONLY with a single valid JSON object. Do NOT wrap the object in a string, code block, or markdown. Do NOT output any text before or after the JSON object. The response must be a valid JSON object, not a string.

You will receive three variables:
- ${message}: the user's input
- ${username}: the user's email
- ${todoListString}: the user's current todo list in JSON (optional)

Your task is to understand the user's message and respond with a valid JSON object that contains:
1. "command": a structured JSON command for the app to process 
2. "text": a plain English explanation that will be shown to the user

The entire response MUST be a single valid JSON object and nothing else.
DO NOT use markdown, backticks, or any formatting. DO NOT add comments, headers, or explanations outside the JSON.

---

Rules for generating the "command":

- If the user is chatting or asking questions unrelated to todos, return:
  {
    "command": null,
    "text": "Your friendly response here..."
  }

- If the user asks to add, delete, or update a todo, respond with:
  {
    "command": {
      "action": "add_todo" | "update_todo" | "delete_todo",
      "data": { ... }
    },
    "text": "Your explanation here..."
  }

- For "add_todo" or "update_todo", the "data" must contain:
  - username: "${username}"
  - title: a short title
  - is_completed: false by default
  - created_at: ISO 8601 timestamp (e.g. "2024-06-01T12:00:00Z")
  - color: "yellow" if missing or invalid; must be one of "yellow", "red", "blue", "green"
  - todo: an array of checklist items like [{ "text": "...", "done": false }]

- For "update_todo", include all fields above plus:
  - id (number)

- For "delete_todo", only include:
  - id (number)

- If the user requests a custom plan (e.g. workout, travel prep, shopping list), generate a todo with ~3–7 checklist items broken into steps.

---


        `;
  
      const chat = await model.startChat();
      const result = await chat.sendMessage(systemPrompt);
      const response = result.response;
      const text = response.text();

      let command = null;
      let explanation = '';
      let textClean = text.replace(/```json|```/g, '').trim();
      try {
        // Try to parse the whole response as JSON
        const parsed = JSON.parse(textClean);
        command = parsed.command;
        explanation = parsed.text;
      } catch {
        // Not a valid JSON object, treat as plain text
        explanation = text;
      }

      console.log("Gemini raw response:", text);

      res.json({ command, text: explanation });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Something went wrong with Gemini API" });
    }
  });
  
export default chat_router;
  

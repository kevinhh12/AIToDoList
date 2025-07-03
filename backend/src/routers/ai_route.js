import e from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";



const chat_router = e.Router();

const backendURL = process.env.VITE_API_URL;


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
        - If the user asks you to add, delete, or modify a todo, respond with BOTH:
          1. A JSON command (for the app to process, on the first line, as raw JSON, with NO markdown or code block).
          2. A plain English explanation (for the user, on the next line).
        - For \"add_todo\" and \"update_todo\" actions, ALWAYS include all of these fields in the \"data\" object:
          - username (string)
          - title (string)
          - is_completed (boolean)
          - created_at (ISO 8601 string, e.g. \"2024-06-01T12:00:00Z\")
          - color (string, must be one of: \"yellow\", \"red\", \"blue\", \"green\")
          - todo (an array of checklist items, e.g. [{\"text\": \"Buy milk\", \"done\": false}])
        - If the user does not specify a color, set \"color\" to \"yellow\".
        - If the user specifies a color that is not \"yellow\", \"red\", \"blue\", or \"green\", set \"color\" to \"yellow\".
        - Example for adding:
          {"action": "add_todo", "data": {"username": "alice", "title": "Buy milk", "is_completed": false, "created_at": "2024-06-01T12:00:00Z", "color": "yellow", "todo": [{"text": "Buy milk", "done": false}]}}
        - Example for updating:
          {"action": "update_todo", "data": {"id": 123, "username": "alice", "title": "Buy eggs", "is_completed": true, "created_at": "2024-06-01T12:00:00Z", "color": "blue", "todo": [{"text": "Buy eggs", "done": true}]}}
        - If the user is just chatting or asking a question, reply in plain text as a helpful assistant.
        - DO NOT mention about the username in your text response.
        - DO NOT use markdown, code blocks, or any extra formatting for the JSON command. The first line must be valid JSON only.
        - When the user tries removing an item, the action is update.
        - When the user is deleting a plan, the action is delete.
        - For \"update_todo\" actions, ALWAYS include all of these fields in the \"data\" object:
          - id (number, the todo's unique identifier)
          - username (string)
          - title (string)
          - is_completed (boolean)
          - created_at (ISO 8601 string)
          - color (string, must be one of: \"yellow\", \"red\", \"blue\", \"green\")
          - todo (an array of checklist items, e.g. [{\"text\": \"Buy milk\", \"done\": false}])
        
        - Customize a plan if the user ask to do so.
        - The number 1, 2, 3.... represents the order of the todo items
        
        Here is the user's current todo list (as JSON):
        ${todoListString}

        User request: ${message}

        Here is the username :${username}
        `;
  
      const chat = await model.startChat();
      const result = await chat.sendMessage(systemPrompt);
      const response = result.response;
      const text = response.text();
  
      // Split the response into lines
      const [jsonLine, ...textLines] = text.split('\n').filter(Boolean);
  
      let command = null;
      let explanation = textLines.join('\n');
      let jsonLineClean = jsonLine.replace(/```json|```/g, '').trim();
      try {
        command = JSON.parse(jsonLineClean);
      } catch {
        // Not a command, treat the whole response as plain text
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
  

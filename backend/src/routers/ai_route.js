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
You are a friendly AI assistant who can help with todo lists, but you're also great at general conversation.

You MUST respond with a single valid JSON object like this:

{
  "command": { ... },
  "text": "..." 
}

DO NOT wrap the JSON inside a string.
DO NOT return JSON as a code block or inside markdown.
DO NOT include any explanation or formatting outside the JSON.

You will receive:
- ${message}: the user's input
- ${username}: the user's email  
- ${todoListString}: the user's current todo list in JSON (optional)

**IMPORTANT: Default to friendly conversation unless explicitly asked for todo help.**

---

Response Rules:

1. **For general conversation, greetings, questions, or casual chat:**
   {
     "command": null,
     "text": "Your friendly, conversational response here..."
   }

2. **ONLY for explicit todo requests, respond with:**
   {
     "command": {
       "action": "add_todo" | "update_todo" | "delete_todo",
       "data": { ... }
     },
     "text": "Your explanation here..."
   }

**Examples of when to use command: null (general conversation):**
- "hello", "hi", "hey"
- "how are you?", "what's up?", "wassup"
- "tell me a joke", "what's the weather like?"
- Any casual conversation or questions

**Examples of when to use command with todo actions:**
- "Create a todo for shopping"
- "Add a task to remember my meeting"
- "I need to make a workout plan"
- "Delete my old todo"

**Be conversational and natural. Don't force todo management into every response.**

**CRITICAL: When users say "hello", "hi", "what's up", etc., respond naturally with conversation. DO NOT ask "How can I help you manage your to-do lists today?" unless they specifically ask about todos.**

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
        // If we can't parse JSON, treat as general conversation (not a todo request)
        command = null;
        explanation = text || "I'm here to help! Feel free to ask me to create a todo or just chat with me.";
      }

      console.log("Gemini raw response:", text);

      res.json({ command, text: explanation });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Something went wrong with Gemini API" });
    }
  });
  
export default chat_router;
  

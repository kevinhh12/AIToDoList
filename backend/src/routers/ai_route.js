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
      const systemPrompt = `You are a helpful AI assistant. You can help with general conversation and also assist with todo list management when specifically requested.

User's message: "${message}"
User: ${username}
Current todo list: ${todoListString}

IMPORTANT: You must respond with valid JSON only. No markdown, no code blocks, no explanations outside the JSON.

Response Format:
{
  "command": null,
  "text": "Your response message here"
}

For general conversation (greetings, questions, casual chat):
- Set "command" to null
- Put your response in "text"

For todo-related requests:
- Set "command" to the appropriate action object
- Put your explanation in "text"

Examples:

General conversation:
- "Hello" → {"command": null, "text": "Hi there! How are you doing today?"}
- "How are you?" → {"command": null, "text": "I'm doing great, thanks for asking! How about you?"}
- "Tell me a joke" → {"command": null, "text": "Why don't scientists trust atoms? Because they make up everything! 😄"}

Todo requests:
- "Add a shopping task" → {"command": {"action": "add_todo", "data": {"title": "Shopping", "description": "Go grocery shopping"}}, "text": "I've added a shopping task to your todo list!"}
- "Create a workout reminder" → {"command": {"action": "add_todo", "data": {"title": "Workout", "description": "Exercise routine"}}, "text": "Workout reminder added to your todos!"}

Remember: Only respond with the JSON object. No additional text or formatting.`;
  
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
  

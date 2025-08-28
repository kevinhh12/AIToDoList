import e from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const chat_router = e.Router();

const backendURL = process.env.BACKEND_URL;

// Fetch your API_KEY
const API_KEY = process.env.GEMINI_AI_API;

// Access your API key
const genAI = new GoogleGenerativeAI(API_KEY);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

chat_router.post('/chat', async (req, res) => {
    const {username, message } = req.body;
  
    try {
      // Fetch the user's todo list
      const todo = await axios.get(`${backendURL}/toDo/internal-get/${username}`);
      const todoListString = JSON.stringify(todo.data, null, 2);

      // Clear, focused system prompt for the AI
      const systemPrompt = `You are a helpful AI assistant for managing todo lists. 

User: ${username}
Current todos: ${todoListString}
User message: "${message}"

RESPOND WITH JSON ONLY. No markdown, no explanations outside the JSON.

For general conversation (greetings, questions, casual chat):
{
  "command": null,
  "text": "Your friendly response here"
}

For todo management requests:
{
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Task title",
      "is_completed": false,
      "color": "#3B82F6",
      "todo": [{"text": "Task description", "checked": false}]
    }
  },
  "text": "I've added [task name] to your todo list!"
}

Available actions:
- add_todo: Create new todo items
- delete_todo: Remove todo items (requires todo ID)
- update_todo: Modify existing todos (requires todo ID)

Examples:
- "Add a shopping task" → Create add_todo command with shopping details
- "Create a workout reminder" → Create add_todo command with workout details
- "Hello" → {"command": null, "text": "Hi there! How can I help with your todos today?"}
- "Show my tasks" → {"command": null, "text": "You have ${todo.data.length} tasks. Here they are: ${todoListString}"}

Specific examples:
User: "Add grocery shopping"
AI: {
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Grocery Shopping",
      "is_completed": false,
      "color": "#3B82F6",
      "todo": [{"text": "Buy groceries", "checked": false}]
    }
  },
  "text": "I've added Grocery Shopping to your todo list!"
}

User: "Create a workout task"
AI: {
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Workout",
      "is_completed": false,
      "color": "#10B981",
      "todo": [{"text": "Complete workout routine", "checked": false}]
    }
  },
  "text": "I've added Workout to your todo list!"
}

Always respond with valid JSON.`;

      const chat = await model.startChat();
      const result = await chat.sendMessage(systemPrompt);
      const response = result.response;
      const text = response.text();

      console.log("Gemini raw response:", text);

      // Clean and parse the response
      let textClean = text.replace(/```json|```/g, '').trim();
      let command = null;
      let explanation = '';

      try {
        const parsed = JSON.parse(textClean);
        command = parsed.command;
        explanation = parsed.text;
        
        // Validate the command structure if it exists
        if (command && command.action === 'add_todo') {
          if (!command.data || !command.data.username || !command.data.title || !command.data.todo) {
            console.warn("Invalid add_todo command structure:", command);
            command = null;
            explanation = "I had trouble creating that todo. Please try again with a clearer description.";
          }
        }
        
        console.log("Parsed command:", command);
        console.log("Parsed explanation:", explanation);
        
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        console.error("Raw text that failed to parse:", textClean);
        // Fallback to general conversation
        command = null;
        explanation = text || "I'm here to help! Feel free to ask me to create a todo or just chat with me.";
      }

      res.json({ command, text: explanation });
    } catch (error) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: "Something went wrong with Gemini API" });
    }
  });
  
export default chat_router;
  

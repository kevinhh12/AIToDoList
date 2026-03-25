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
      const systemPrompt = `You are an intelligent AI assistant that creates customized, detailed todo lists based on user requirements.

User: ${username}
Current todos: ${todoListString}
User message: "${message}"

RESPOND WITH JSON ONLY. No markdown, no explanations outside the JSON.

For general conversation (greetings, questions, casual chat):
{
  "command": null,
  "text": "Your friendly response here"
}

For todo creation requests, analyze the user's intent and create detailed, customized todo lists:

SHOPPING LISTS:
- "I want to make steak tonight" → Create a shopping list with steak ingredients
- "I need groceries for pasta" → Create a shopping list with pasta ingredients
- "Shopping for breakfast" → Create a breakfast shopping list

TASK LISTS:
- "I need to clean my house" → Create a detailed cleaning checklist
- "I want to start a workout routine" → Create a workout plan
- "I need to organize my workspace" → Create an organization checklist

PROJECT LISTS:
- "I want to plan a party" → Create a party planning checklist
- "I need to study for exams" → Create a study plan
- "I want to start a garden" → Create a gardening setup checklist

Response format for todos:
{
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Descriptive title",
      "is_completed": false,
      "color": "#FCD34D",
      "todo": [
        {"text": "Detailed task 1", "checked": false},
        {"text": "Detailed task 2", "checked": false},
        {"text": "Detailed task 3", "checked": false}
      ]
    }
  },
  "text": "I've created a detailed [type] list for you with [X] items!"
}

Examples:

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
  

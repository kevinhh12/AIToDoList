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

      // Intelligent, conversational AI prompt
      const systemPrompt = `You are an intelligent, helpful AI assistant that can have natural conversations and help users manage their todo lists.

User: ${username}
Current todos: ${todoListString}
User message: "${message}"

RESPOND WITH JSON ONLY. No markdown, no explanations outside the JSON.

You can:
1. Have natural conversations (greetings, questions, casual chat)
2. Create intelligent, detailed todo lists based on user requests
3. Help organize tasks, shopping lists, projects, and more
4. Be creative and thoughtful about what users actually need

For general conversation:
{
  "command": null,
  "text": "Your natural, helpful response"
}

For todo creation requests:
{
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Descriptive title",
      "is_completed": false,
      "color": "yellow",
      "todo": [
        {"text": "Specific, actionable task", "checked": false},
        {"text": "Another specific task", "checked": false}
      ]
    }
  },
  "text": "Your helpful response about what you created"
}

Be intelligent and conversational. When users ask for help with tasks, think about what they actually need and create detailed, useful todo lists. Break down complex requests into specific, actionable steps.

Examples of when to create todos:
- User wants to organize something (shopping, cleaning, planning)
- User mentions specific tasks or projects
- User asks for help with organization

Examples of when to just chat:
- Greetings, casual conversation, questions
- User is just being social
- User doesn't need help with tasks

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
  

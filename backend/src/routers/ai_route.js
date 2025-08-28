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

User: "I want to make steak tonight"
AI: {
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Steak Dinner Shopping List",
      "is_completed": false,
      "color": "#FCD34D",
      "todo": [
        {"text": "Ribeye or New York strip steak", "checked": false},
        {"text": "Fresh garlic", "checked": false},
        {"text": "Fresh rosemary or thyme", "checked": false},
        {"text": "Butter", "checked": false},
        {"text": "Olive oil", "checked": false},
        {"text": "Salt and black pepper", "checked": false},
        {"text": "Potatoes for side dish", "checked": false},
        {"text": "Green vegetables (asparagus/broccoli)", "checked": false}
      ]
    }
  },
  "text": "I've created a detailed steak dinner shopping list for you with 8 items!"
}

User: "I need to clean my house"
AI: {
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "House Cleaning Checklist",
      "is_completed": false,
      "color": "#FCD34D",
      "todo": [
        {"text": "Dust all surfaces and shelves", "checked": false},
        {"text": "Vacuum carpets and mop floors", "checked": false},
        {"text": "Clean kitchen counters and appliances", "checked": false},
        {"text": "Scrub bathroom sink and shower", "checked": false},
        {"text": "Change bed sheets and towels", "checked": false},
        {"text": "Take out trash and recycling", "checked": false},
        {"text": "Organize cluttered areas", "checked": false}
      ]
    }
  },
  "text": "I've created a detailed house cleaning checklist for you with 7 tasks!"
}

User: "Hello"
AI: {"command": null, "text": "Hi there! I'm your smart todo assistant. I can create detailed shopping lists, cleaning checklists, workout plans, and more. What would you like me to help you organize today?"}

User: "I want to start a workout routine"
AI: {
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Workout Routine Setup",
      "is_completed": false,
      "color": "#FCD34D",
      "todo": [
        {"text": "Get comfortable workout clothes", "checked": false},
        {"text": "Find a good workout space at home", "checked": false},
        {"text": "Download fitness app or find workout videos", "checked": false},
        {"text": "Start with 20-minute beginner workout", "checked": false},
        {"text": "Schedule 3 workout days per week", "checked": false},
        {"text": "Track progress and how you feel", "checked": false}
      ]
    }
  },
  "text": "I've created a detailed workout routine setup checklist for you with 6 tasks!"
}

User: "I need to plan a dinner party"
AI: {
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Dinner Party Planning",
      "is_completed": false,
      "color": "#FCD34D",
      "todo": [
        {"text": "Decide on guest list and send invitations", "checked": false},
        {"text": "Plan menu and check dietary restrictions", "checked": false},
        {"text": "Create shopping list for ingredients", "checked": false},
        {"text": "Clean and decorate dining area", "checked": false},
        {"text": "Prepare appetizers and main course", "checked": false},
        {"text": "Set table with plates, glasses, and utensils", "checked": false},
        {"text": "Have background music ready", "checked": false}
      ]
    }
  },
  "text": "I've created a detailed dinner party planning checklist for you with 7 tasks!"
}

User: "I want to make Italian pasta for dinner"
AI: {
  "command": {
    "action": "add_todo",
    "data": {
      "username": "${username}",
      "title": "Italian Pasta Dinner Shopping List",
      "is_completed": false,
      "color": "#FCD34D",
      "todo": [
        {"text": "Spaghetti or fettuccine pasta", "checked": false},
        {"text": "Fresh garlic (at least 4 cloves)", "checked": false},
        {"text": "Extra virgin olive oil", "checked": false},
        {"text": "Fresh basil leaves", "checked": false},
        {"text": "Parmesan cheese (freshly grated)", "checked": false},
        {"text": "Cherry tomatoes or canned tomatoes", "checked": false},
        {"text": "Red pepper flakes", "checked": false},
        {"text": "Salt and black pepper", "checked": false},
        {"text": "Fresh parsley for garnish", "checked": false}
      ]
    }
  },
  "text": "I've created a detailed Italian pasta dinner shopping list for you with 9 ingredients!"
}

Always respond with valid JSON. Be creative and thorough when creating todo lists - think about what someone would actually need to complete the task successfully.

TIPS FOR CREATING GREAT TODO LISTS:
- Break down complex tasks into specific, actionable steps
- Think about the logical order of tasks
- Include preparation steps (like gathering supplies)
- Consider common obstacles and include solutions
- Make tasks specific enough to be actionable
- For shopping lists, think about quantities and alternatives
- For project planning, include both planning and execution steps

The more specific and helpful your todo lists are, the more useful they'll be to the user!`;

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
  

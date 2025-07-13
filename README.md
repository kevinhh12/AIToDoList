# AI ToDo List

A modern, intelligent task management application powered by Google's Gemini AI. This full-stack web application combines the convenience of traditional todo lists with the power of artificial intelligence to help users organize, prioritize, and complete tasks more efficiently.

## 🌟 Features

- **AI-Powered Chatbot**: Natural language interaction with Google Gemini AI for task creation and management
- **Smart Task Organization**: AI automatically categorizes and prioritizes tasks based on user input
- **Google OAuth2 Authentication**: Secure login using Google accounts
- **Real-time Task Management**: Create, update, and delete tasks with instant synchronization
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Secure Data Storage**: PostgreSQL database with encrypted session management
- **Rate Limiting**: API protection against abuse and spam

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-frontend-url.vercel.app)
- **Backend**: [Deployed on Render](https://your-backend-url.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons


### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Google Gemini AI** - AI integration for natural language processing
- **Passport.js** - Authentication middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limiter** - API protection

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Google Cloud Platform account (for Gemini AI API)
- Google OAuth2 credentials

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/kevinhh12/AIToDoList.git
cd ai-todo-list/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

Add your environment variables:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

4. Start development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd ../backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.example .env
```

Add your environment variables:
```env
DATABASE_URL=your_postgresql_connection_string
GEMINI_AI_API=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
SESSION_SECRET=your_session_secret
BACKEND_URL=https://your-backend-url.onrender.com
```

4. Set up PostgreSQL database:
```sql
CREATE TABLE tdl (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  color VARCHAR(50) DEFAULT 'yellow',
  todo JSONB
);
```

5. Start the server:
```bash
npm start
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend URL
3. Deploy automatically on push to main branch

### Backend (Render)

1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard:
   - `DATABASE_URL`: PostgreSQL connection string
   - `GEMINI_AI_API`: Google Gemini API key
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
   - `SESSION_SECRET`: Session encryption secret
   - `BACKEND_URL`: Your backend URL
3. Set build command: `npm install`
4. Set start command: `npm start`

## 🔧 API Endpoints

### Authentication
- `POST /auth/google` - Google OAuth login
- `GET /auth/logout` - Logout user

### Tasks
- `GET /toDo/get/:email` - Get user's tasks
- `POST /toDo/create` - Create new task
- `PUT /toDo/update/:id` - Update task
- `DELETE /toDo/delete/:id` - Delete task

### AI Chat
- `POST /ai/chat` - Send message to AI chatbot

## 🤖 AI Features

The application integrates Google's Gemini AI to provide intelligent task management:

- **Natural Language Processing**: Users can describe tasks in plain English
- **Smart Task Creation**: AI automatically extracts task details and creates structured todos
- **Context Awareness**: AI considers user's existing tasks when making suggestions
- **Intelligent Responses**: AI provides helpful explanations and suggestions

## 📱 Usage

1. **Login**: Use your Google account to authenticate
2. **Chat with AI**: Use the sidebar chatbot to create tasks naturally
3. **Manage Tasks**: View, edit, and delete tasks through the main interface
4. **Stay Organized**: Let AI help you prioritize and organize your tasks


## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for AI capabilities
- [Vercel](https://vercel.com/) for frontend hosting
- [Render](https://render.com/) for backend hosting
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components

## 📞 Support

If you have any questions or need help, please open an issue on GitHub .

---


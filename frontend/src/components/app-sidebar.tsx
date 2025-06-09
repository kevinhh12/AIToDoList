import { Send, Bot, User, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,

  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { Card, CardContent, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback } from "./ui/avatar"


/////////////////
interface Message { 
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}
/////////////////

export function AppSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date()
    },
    {
      id: '2',
      content: 'I can help you with coding, answer questions, or just chat!',
      role: 'assistant',
      timestamp: new Date()
    },
    {
      id: '3',
      content: 'What would you like to work on?',
      role: 'user',
      timestamp: new Date()
    },
    {
      id: '4',
      content: 'I\'d like to build a React application with TypeScript.',
      role: 'assistant',
      timestamp: new Date()
    },
    {
      id: '5',
      content: 'Great! I can help you with React and TypeScript. What kind of application are you thinking of building?',
      role: 'assistant',
      timestamp: new Date()
    },
    {
      id: '6',
      content: 'I want to build a todo list app with authentication.',
      role: 'user',
      timestamp: new Date()
    },
    {
      id: '7',
      content: 'Excellent choice! A todo app is perfect for learning React. We can use Firebase for authentication and a database.',
      role: 'assistant',
      timestamp: new Date()
    },
    {
      id: '8',
      content: 'Should I use Next.js or just plain React?',
      role: 'user',
      timestamp: new Date()
    },
    {
      id: '9',
      content: 'For a todo app, plain React with Vite would be perfect. Next.js is great for larger applications with server-side rendering.',
      role: 'assistant',
      timestamp: new Date()
    },
    {
      id: '10',
      content: 'Perfect! Let\'s start building it together.',
      role: 'user',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => { // this handles the response after a usr type something 
    if (!input.trim() || isLoading) return //if the input is empoty or its loading

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you said: "${input.trim()}". This is a simulated response. In a real implementation, you would connect this to an AI API like OpenAI, Anthropic, or your own model.`,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    // it makes the ref DOM element visible and scroll to the last visible element 
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  return (
    <Sidebar className="h-full">
      <SidebarHeader className="border-b p-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI ToDoList Assistant
        </CardTitle>
      </SidebarHeader>
      
      <SidebarContent className="h-full">
        <SidebarGroup className="h-full">
          <SidebarGroupContent className="h-full flex-1 p-0">
            <ScrollArea  className="flex-1">
              <Card className="h-full flex flex-col">
                <CardContent className="h-full flex-1 p-0 flex flex-col">
                  
                    <div className="p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          
                          {message.role === 'user' && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-secondary">
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={endOfMessagesRef} /> 
                    </div>
                  
                </CardContent>
              </Card>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
import { createContext, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const backend_URL = import.meta.env.VITE_API_URL;

// Define the context type
interface AIContextType {
  sendMessage: (message: string) => Promise<{ command: any, text: string }>;
}

// Create the context
const AIContext = createContext<AIContextType | undefined>(undefined);

// Provider component
export const AIProvider = ({ children }: { children: ReactNode }) => {
  // Function to send a message to the backend AI route
    const {userData} = useAuth();
    const username = userData?.email;

    const sendMessage = async (message: string) => {
        if (!userData || !userData.email) throw new Error("User not authenticated");

        const res = await axios.post(`${backend_URL}/ai/chat`, { username, message });
        return res.data;
    };

  return (
    <AIContext.Provider value={{ sendMessage }}>
      {children}
    </AIContext.Provider>
  );
};

// Custom hook to use the AI context
export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within an AIProvider');
  return context;
};
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const backend_URL = import.meta.env.VITE_API_URL;

// Define the context type
interface TodoContextType {
  todos: any[];
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (updated: any) => Promise<void>;
  addTodo: (newTodo: any) => Promise<any>;
  fetchTodosFromDB: () => Promise<void>; 
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function ToDoProvider({ children }: { children: ReactNode }) {
    const {userData }= useAuth();
    const email = userData?.email;
    console.log(email);
    // console.log(userData)

    const [todos, setTodos] = useState<any[]>([]);


    const fetchTodosFromDB = async () => {
        if (!email) return;
        const res = await axios.get(`${backend_URL}/toDo/get/${email}`, {
          withCredentials: true
        });
        setTodos(res.data);
      };
      
      useEffect(() => {
        fetchTodosFromDB(); // run once on login
      }, [email]);


    // Delete a todo by id
    const deleteTodo = async (id: number) => {
        await axios.delete(`${backend_URL}/toDo/delete/${id}`, { withCredentials: true });
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const addTodo = async (newTodo: any) => {
        const res = await axios.post(
            `${backend_URL}/toDo/create`,
            newTodo,
            { withCredentials: true }
        );
        setTodos(prev => [...prev, res.data]);
        return res.data;
    };

    // Update a todo (full object)
    const updateTodo = async (updated: any) => {
        await axios.put(`${backend_URL}/toDo/update/${updated.id}`, updated, { withCredentials: true });
        setTodos(prev => prev.map(todo => todo.id === updated.id ? updated : todo));
    };

    return(
        <TodoContext.Provider value={{ todos, deleteTodo, updateTodo, addTodo, fetchTodosFromDB }} >
            {children}
        </TodoContext.Provider>

    )
}

export function useTodo(){
    const ctx = useContext(TodoContext);
    if (!ctx) throw new Error("useTodo must be used within a ToDoProvider");
    return ctx;
}
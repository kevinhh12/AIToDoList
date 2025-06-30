import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTodo } from "../context/ToDoContext";
import Memo from "./ui/memo";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import Alert from "./app-alert"; // adjust path if needed




type MemoType = {
  id: number;
  username: string;
  title: string;
  is_completed: boolean;
  created_at: string;
  color: string;
  todo: { text: string; checked: boolean }[];
};

export default function ToDo() {
  const { isLoggedIn, userData } = useAuth();
  const {  todos, deleteTodo, updateTodo, addTodo } = useTodo();


  console.log(`isloggedin: ${isLoggedIn}`)

  const [memos, setMemos] = useState<MemoType[]>(todos);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingDeleteIdx, setPendingDeleteIdx] = useState<number | null>(null);

  useEffect(() => {
    setMemos(todos);
  }, [todos]);

  // Handler to trigger alert
  const handleDeleteRequest = (idx: number) => {
    setPendingDeleteIdx(idx);
    setAlertOpen(true);
  };

  // Handler to confirm deletion
  const handleConfirmDelete = () => {
    if (pendingDeleteIdx !== null) {
      console.log(pendingDeleteIdx)
      deleteTodo(pendingDeleteIdx)
      setEditingIdx(null);
      setPendingDeleteIdx(null);
    }
    setAlertOpen(false);
  };

  // Handler to cancel deletion
  const handleCancelDelete = () => {
    setPendingDeleteIdx(null);
    setEditingIdx(null);
    setAlertOpen(false);
  };

  return (
    <div className="container py-3 px-3 relative min-h-screen">
      {isLoggedIn ? (
        <>
          {/* Sticky Notes */}
          <div data-aos="fade-up" className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 w-full">
            {[...memos]
              .sort((a, b) => a.id - b.id) // sort the todo based on the id created 
              .map((memo) => (
                <div
                  key={memo.id}
                  className="transition-transform duration-200 hover:scale-105"
                >
                  <Memo
                    {...memo}
                    editing={editingIdx === memo.id}
                    onEdit={() => {
                      setEditingIdx(memo.id)
                      console.log(editingIdx) // debug
                    }}
                    onChangeTitle={title => {
                      const newMemos = memos.map(m => m.id === memo.id ? { ...m, title } : m);
                      setMemos(newMemos);
                      updateTodo(newMemos.find(m => m.id === memo.id)!);
                      
                    }}
                    onChangeTodo={todoArr => {
                      const newMemos = memos.map(m => m.id === memo.id ? { ...m, todo: todoArr } : m);
                      setMemos(newMemos);
                      
                      updateTodo(newMemos.find(m => m.id === memo.id)!);

                    }}
                    onDoneEdit={() => setEditingIdx(null)}
                    
                    onToggleTodo={todoIdx => {
                      const newMemos = memos.map(m => {
                        if (m.id === memo.id) {
                          const todoArr = [...m.todo];
                          todoArr[todoIdx].checked = !todoArr[todoIdx].checked;
                          return { ...m, todo: todoArr };
                        }
                        return m;
                      });
                      setMemos(newMemos);
                      updateTodo(newMemos.find(m => m.id === memo.id)!);
                    }}
                    onDelete={() => handleDeleteRequest(memo.id)}

                    onColor={(color) => {
                      const newMemos = memos.map(m => m.id === memo.id ? { ...m, color } : m);
                      setMemos(newMemos);
                      updateTodo(newMemos.find(m => m.id === memo.id)!);
                    }}
                  
                  />
                </div>
              ))}
          </div>
            {!editingIdx &&(
                              <button
                              className="transition-colors duration-200 fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-6 rounded-full shadow-lg text-2xl z-50"
                              
                              onClick={async () => {
                                const newMemo = {
                                  username: userData?.email || "",
                                  title: "",
                                  is_completed: false,
                                  color: "yellow",
                                  todo: [{ text: "", checked: false }]
                                };
                                const added = await addTodo(newMemo);
                                setEditingIdx(added.id);
                              }}
                            >
                              +
                            </button>
            )}

         

           
        </>
      ) : (
        <h1>Please log in to see your tasks.</h1>
      )}
      <Alert
        alertOpen={alertOpen}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
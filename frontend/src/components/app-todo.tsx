import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Memo from "./ui/memo";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import Alert from "./app-alert"; // adjust path if needed

type ChecklistItem = { text: string; checked: boolean };

type TodoItem = { text: string; checked: boolean };

type MemoType = {
  title: string;
  due?: string;
  dueTime?: string;
  color?: string;
  checklist?: ChecklistItem[];
  todo: TodoItem[];
};

export default function ToDo() {
  const { isLoggedIn } = useAuth();
  const [memos, setMemos] = useState<MemoType[]>([
    { 
      title: "Shopping list", 
      todo: [
        { text: "Figs", checked: false },
        { text: "Bread", checked: false },
        { text: "Brie", checked: true }
      ],
      color: "yellow",
    },
    { 
      title: "Send photos from the zoo to Harry and bnlabla ", 
      todo: [
        { text: "Send photos", checked: false }
      ],
      color: "red",
    },
    { 
      title: "Anniversary ideas", 
      todo: [
        { text: "Let's think about what to do this year.", checked: false },
        { text: "Love you!", checked: false }
      ],
      color: "blue",
    },
  ]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [pendingDeleteIdx, setPendingDeleteIdx] = useState<number | null>(null);

  // Handler to trigger alert
  const handleDeleteRequest = (idx: number) => {
    setPendingDeleteIdx(idx);
    setAlertOpen(true);
  };

  // Handler to confirm deletion
  const handleConfirmDelete = () => {
    if (pendingDeleteIdx !== null) {
      setMemos(prevMemos => prevMemos.filter((_, i) => i !== pendingDeleteIdx));
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
            {memos.map((memo, idx) => (
              <div
                key={idx}
                className="transition-transform duration-200 hover:scale-105"
              >
                <Memo
                  {...memo}
                  editing={editingIdx === idx}
                  onEdit={() => setEditingIdx(idx)}
                  onChangeTitle={title => {
                    const newMemos = [...memos];
                    newMemos[idx].title = title;
                    setMemos(newMemos);
                  }}
                  onChangeTodo={todoArr => {
                    const newMemos = [...memos];
                    newMemos[idx].todo = todoArr;
                    setMemos(newMemos);
                  }}
                  onDoneEdit={() => setEditingIdx(null)}
                  onToggleTodo={todoIdx => {
                    const newMemos = [...memos];
                    const todoArr = newMemos[idx].todo || [];
                    todoArr[todoIdx].checked = !todoArr[todoIdx].checked;
                    setMemos(newMemos);
                  }}
                  onDelete={() => handleDeleteRequest(idx)}
                />
              </div>
            ))}
          </div>
              <button
                className="transition-colors duration-200 fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-6 rounded-full shadow-lg text-2xl z-50"
                
                onClick={() => {
                  setMemos([
                    ...memos,
                    { title: "", todo: [{ text: "", checked: false }], color: "yellow", due: "" }
                  ]);
                  setEditingIdx(memos.length); // index of the new memo
                }}
              >
                +
              </button>
           
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
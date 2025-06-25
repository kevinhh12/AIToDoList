import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Memo from "./ui/memo";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

type ChecklistItem = { text: string; checked: boolean };

type MemoType = {
  title: string;
  due?: string;
  dueTime?: string;
  color?: string;
  checklist?: ChecklistItem[];
  todo?: string[];
};

export default function ToDo() {
  const { isLoggedIn } = useAuth();
  const [memos, setMemos] = useState<MemoType[]>([
    { 
      title: "Shopping list", 
      todo: ["Figs", "Bread", "Brie"],
      color: "yellow",
    },
    { 
      title: "Send photos from the zoo to Harry and bnlabla ", 
      todo: ["Send photos"],
      color: "red",
    },
    { 
      title: "Anniversary ideas", 
      todo: ["Let's think about what to do this year.", "Love you!"],
      color: "blue",
    },
  ]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  return (
    <div className="container py-3 px-3 relative min-h-screen">
      {isLoggedIn ? (
        <>
          {/* Sticky Notes */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 w-full">
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
                />
              </div>
            ))}
          </div>
              <button
                className="transition-colors duration-200 fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-6 rounded-full shadow-lg text-2xl z-50"
                aria-label="Add Memo"
                onClick={() => {
                  setMemos([
                    ...memos,
                    { title: "", todo: [""], color: "yellow", due: "" }
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
    </div>
  );
}
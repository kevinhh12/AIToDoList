
import { Pencil } from "lucide-react";
import { useRef, useEffect } from "react";


interface MemoProps {
  title?: string;
  todo: { text: string; checked: boolean }[];
  color?: string;
  editing?: boolean;
  onChangeTitle?: (title: string) => void;
  onChangeTodo?: (todo: { text: string; checked: boolean }[]) => void;
  onDoneEdit?: () => void;
  onEdit?: () => void;
  onToggleTodo?: (idx: number) => void;
  onDelete?: () => void;
}

export default function Memo({
  title,
  todo = [],
  color = "yellow",
  editing = false,
  onChangeTitle,
  onChangeTodo,
  onDoneEdit,
  onEdit,
  onToggleTodo,
  onDelete,
}: MemoProps) {
  const colorClass = {
    yellow: "bg-yellow-200",
    red: "bg-red-200",
    blue: "bg-blue-200",
    green: "bg-green-200",
    // add more as needed
  }[color];

  const isVisible = todo.some(t => t.text && t.text.trim() !== "");



  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing, todo]);

  return (
    <div className={`${colorClass} rounded-lg shadow-md p-4 mb-4 break-inside-avoid relative`}>
      {editing ? (
        <>
          <input
            className="wdxl-lubrifont-sc-regular font-bold text-lg mb-2 w-full"
            value={title}
            onChange={e => onChangeTitle?.(e.target.value)}
            placeholder="Title"
          />
          <div className="flex justify-center ">
            <textarea
              ref={textareaRef}
              className=" resize-none wdxl-lubrifont-sc-regular text-sm mb-2 w-11/12"
              value={todo.map(t => t.text).join("\n")}
              onInput={e => {
                const ta = e.currentTarget;
                ta.style.height = "auto";
                ta.style.height = ta.scrollHeight + "px";
              }}
              onChange={e =>
                onChangeTodo?.(
                  e.target.value
                    .split("\n")
                    .map(t => ({ text: t, checked: false }))
                )
              }
              placeholder="Todo items (one per line)"
            />
          </div>
         

          <div className="flex justify-between">
          {isVisible && editing &&(
              <button
                  className="  transition-transform duration-100 hover:scale-120 text-gray-400 text-lg flex items-center justify-center"
                  onClick={onDoneEdit}
                  aria-label="Done"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
          )}

          <button
            className="transition-transform duration-100 hover:scale-120 text-gray-400"
            onClick={onDelete}
            aria-label="Delete"
          >
            {/* Trashcan SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3" />
            </svg>
          </button>
          </div>




        </>
      ) : (
        <>
          <h2 className="pr-6 wdxl-lubrifont-sc-regular font-bold text-2xl mb-2">{title}</h2>

            <ol className="list-decimal pl-5 mb-2">
              {todo.filter(td => td.text.trim() !== "").map((td, idx) => (
                <li
                  key={idx}
                  className={`wdxl-lubrifont-sc-regular ml-4 cursor-pointer select-none ${td.checked ? "line-through text-gray-700" : ""}`}
                  onClick={() => onToggleTodo?.(idx)}
                >
                  {td.text}
                </li>
              ))}
            </ol>
          

            <button
                className="absolute top-2 right-2 p-1 transition-transform duration-100 hover:scale-120 text-gray-400"
                onClick={onEdit}
                aria-label="Edit"
              >
                <Pencil size={16} />
              </button>

            
       
        </>
      )}
    </div>
  );
}
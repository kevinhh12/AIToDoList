import { Pencil } from "lucide-react";

interface MemoProps {
  title?: string;
  todo?: string[];
  color?: string;
  editing?: boolean;
  onChangeTitle?: (title: string) => void;
  onChangeTodo?: (todo: string[]) => void;
  onDoneEdit?: () => void;
  onEdit?: () => void;
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
}: MemoProps) {
  const colorClass = {
    yellow: "bg-yellow-200",
    red: "bg-red-200",
    blue: "bg-blue-200",
    green: "bg-green-200",
    // add more as needed
  }[color];

  return (
    <div className={`${colorClass} rounded-lg shadow-md p-4 mb-4 break-inside-avoid relative`}>
      {editing ? (
        <>
          <input
            className="font-bold text-lg mb-2 w-full"
            value={title}
            onChange={e => onChangeTitle?.(e.target.value)}
            placeholder="Title"
          />
          <textarea
            className="text-sm mb-2 w-full"
            value={todo.join(", ")}
            onChange={e => onChangeTodo?.(e.target.value.split(",").map(t => t.trim()))}
            placeholder="Todo items (comma separated)"
          />
          <button
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            onClick={onDoneEdit}
          >
            Done
          </button>
        </>
      ) : (
        <>
          <h2 className="font-bold text-lg mb-2">{title}</h2>
          {todo.length > 0 && (
            <ol className="list-decimal pl-5 mb-2">
              {todo.map((td, idx) => (
                <li key={idx} className="ml-4"> 
                  {td}
                </li>
              ))}
            </ol>
          )}
          {!editing && (
            <button
              className="absolute bottom-2 right-2 p-1 transition-transform duration-100 hover:scale-120 text-gray-400"
              onClick={onEdit}
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
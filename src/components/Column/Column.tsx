import { Column as ColumnType } from "@/types"
import { useTasks } from "@/hooks/useTasks"
import { TaskCard } from "../Task/Task"
import { useState } from "react"

interface Props {
  column: ColumnType
}

export function Column({ column }: Props) {
  const [input, setInput] = useState("")
  const addTask = useTasks((s) => s.addTask)
  const tasks = useTasks((s) => s.tasks)
  const removeColumn = useTasks((s) => s.removeColumn)

  const handleAdd = () => {
    if (input.trim() === "") return
    addTask(column.id, input)
    setInput("")
  }

  return (
    <div className="bg-white rounded-xl shadow-md w-64 p-4 flex flex-col gap-2">
      <div className="flex">
        <div>
          <h2 className="font-bold">{column.title}</h2>
        </div>

        <button
          onClick={() => removeColumn(column.id)}
          className="text-red-500"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          placeholder="New task"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          +
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        {column.taskIds.map((id) => (
          <TaskCard key={id} task={tasks[id]} />
        ))}
      </div>
    </div>
  )
}

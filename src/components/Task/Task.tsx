import { useTasks } from "@/hooks/useTasks"
import { Task } from "@/types"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"

interface Props {
  task: Task
  columnId: string
}

export function TaskCard({ task }: Props) {
  const { toggleComplete, removeTask, editTask, selectTask } = useTasks()

  const [editing, setEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState(task.title)

  const ref = useRef<HTMLDivElement | null>(null)

  const handleEdit = () => {
    if (editing && tempTitle.trim() !== "") {
      editTask(task.id, tempTitle)
    }
    setEditing(!editing)
  }

  useEffect(() => {
    if (!ref.current) return

    return draggable({
      element: ref.current,
      getInitialData: () => ({
        type: "task",
        taskId: task.id,
      }),
    })
  }, [])

  return (
    <div
      ref={ref}
      data-task-id={task.id}
      className={clsx(
        "border rounded p-2 flex items-center justify-between gap-2",
        task.completed ? "bg-green-100 line-through text-gray-500" : "bg-white",
        task.selected ? "ring-2 ring-blue-400" : ""
      )}
    >
      <input
        type="checkbox"
        checked={task.selected}
        onChange={() => selectTask(task.id)}
        className="mr-2"
      />

      {editing ? (
        <input
          className="border px-1 flex-1"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={(e) => e.key === "Enter" && handleEdit()}
        />
      ) : (
        <span onDoubleClick={handleEdit} className="flex-1 cursor-text">
          {task.title}
        </span>
      )}

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        title="Mark complete"
      />

      <button
        onClick={() => removeTask(task.id)}
        className="text-red-500 font-bold"
      >
        ✕
      </button>
    </div>
  )
}

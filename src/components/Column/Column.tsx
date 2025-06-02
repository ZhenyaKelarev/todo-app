import React, { useState } from "react"
import { useTasks } from "@/hooks/useTasks"
import { TaskCard } from "../Task/Task"
import { Column as ColumnType } from "@/types"

interface Props {
  column: ColumnType
}

export function Column({ column }: Props) {
  const {
    tasks,
    addTask,
    selectAllInColumn,
    bulkDelete,
    bulkToggleComplete,
    searchTerm,
    statusFilter,
  } = useTasks()

  const [newTaskTitle, setNewTaskTitle] = useState("")

  const taskList = column.taskIds
    .map((id) => tasks[id])
    .filter(Boolean)
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => {
      if (statusFilter === "all") return true
      if (statusFilter === "completed") return task.completed
      if (statusFilter === "incomplete") return !task.completed
    })

  const allSelected =
    taskList.length > 0 && taskList.every((task) => task.selected)
  const someSelected = taskList.some((task) => task.selected)

  const handleAddTask = () => {
    const title = newTaskTitle.trim()
    if (title) {
      addTask(column.id, title)
      setNewTaskTitle("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTask()
  }

  return (
    <div className="min-w-[250px] border rounded p-4 bg-gray-100 flex flex-col gap-3">
      {/* Заголовок + Select All */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{column.title}</h2>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => selectAllInColumn(column.id, e.target.checked)}
          />
          Вибрати всі
        </label>
      </div>

      {/* Інпут додавання нового завдання */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Нове завдання..."
          className="flex-1 px-2 py-1 border rounded"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          ➕
        </button>
      </div>

      {/* Масові дії */}
      {someSelected && (
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={bulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
          >
            🗑️ Видалити
          </button>
          <button
            onClick={() => bulkToggleComplete(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
          >
            ✅ Виконано
          </button>
          <button
            onClick={() => bulkToggleComplete(false)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
          >
            🔁 Не виконано
          </button>
        </div>
      )}

      {/* Завдання */}
      <div className="flex flex-col gap-2">
        {taskList.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

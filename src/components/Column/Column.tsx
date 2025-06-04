import React, { useEffect, useRef, useState } from "react"
import { useTasks } from "@/hooks/useTasks"
import { TaskCard } from "../Task/Task"
import { Column as ColumnType } from "@/types"
import {
  dropTargetForElements,
  draggable,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import clsx from "clsx"
import { calculateDropIndex } from "@/utils/calculateDropIndex"

interface Props {
  column: ColumnType
}

export function Column({ column }: Props) {
  const {
    tasks,
    columns,
    addTask,
    selectAllInColumn,
    bulkDelete,
    bulkToggleComplete,
    moveTaskToColumn,
    reorderTaskInColumn,
    reorderColumns,
    searchTerm,
    statusFilter,
  } = useTasks()

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const cleanupDrop = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: "column", columnId: column.id }),
      onDragEnter: () => setIsDraggingOver(true),
      onDragLeave: () => setIsDraggingOver(false),
      onDrop: ({ source }) => {
        const taskId = source.data.taskId as string

        const fromColumn = columns.find((col) => col.taskIds.includes(taskId))
        if (fromColumn) {
          const dropIndex = calculateDropIndex(ref.current!)

          if (fromColumn.id !== column.id) {
            moveTaskToColumn(taskId, column.id, dropIndex)
          } else {
            const fromIndex = fromColumn.taskIds.indexOf(taskId)
            if (
              fromIndex !== -1 &&
              dropIndex !== -1 &&
              fromIndex !== dropIndex
            ) {
              reorderTaskInColumn(column.id, fromIndex, dropIndex)
            }
          }
          return
        }

        const sourceColumnId = source.data.columnId as string
        if (
          sourceColumnId &&
          sourceColumnId !== column.id &&
          columns.some((col) => col.id === sourceColumnId)
        ) {
          const fromIndex = columns.findIndex((c) => c.id === sourceColumnId)
          const toIndex = columns.findIndex((c) => c.id === column.id)
          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            reorderColumns(fromIndex, toIndex)
          }
        }
      },
    })

    const cleanupDraggable = draggable({
      element: ref.current,
      getInitialData: () => ({
        type: "column",
        columnId: column.id,
      }),
    })

    return () => {
      cleanupDrop()
      cleanupDraggable()
    }
  }, [ref.current, columns])

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
    <div
      ref={ref}
      className={clsx(
        "min-w-[250px] border rounded p-4 flex flex-col gap-3 transition",
        isDraggingOver ? "bg-blue-100" : "bg-gray-100"
      )}
    >
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{column.title}</h2>
        {taskList.length > 0 && (
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => selectAllInColumn(column.id, e.target.checked)}
            />
            Вибрати всі
          </label>
        )}
      </div>

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

      <div className="flex flex-col gap-2">
        {taskList.map((task) => (
          <TaskCard columnId={column.id} key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

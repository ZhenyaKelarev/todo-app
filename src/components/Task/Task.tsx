import { Task } from '@/types'
import { useTasks } from '@/hooks/useTasks'
import { useState } from 'react'
import clsx from 'clsx'

interface Props {
  task: Task
}

export function TaskCard({ task }: Props) {
  const toggleComplete = useTasks((s) => s.toggleComplete)
  const removeTask = useTasks((s) => s.removeTask)
  const editTask = useTasks((s) => s.editTask)

  const [editing, setEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState(task.title)

  const handleEdit = () => {
    if (editing && tempTitle.trim() !== '') {
      editTask(task.id, tempTitle)
    }
    setEditing(!editing)
  }

  return (
    <div
      className={clsx(
        'border rounded p-2 flex items-center justify-between gap-2',
        task.completed ? 'bg-green-100 line-through text-gray-500' : 'bg-white'
      )}
    >
      <div className="flex items-center gap-2 w-full">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
        />
        {editing ? (
          <input
            className="border rounded px-1 py-0.5 w-full"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
            autoFocus
          />
        ) : (
          <span onDoubleClick={handleEdit} className="flex-1 cursor-text">
            {task.title}
          </span>
        )}
      </div>

      <button
        onClick={() => removeTask(task.id)}
        className="text-red-500 font-bold"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  )
}

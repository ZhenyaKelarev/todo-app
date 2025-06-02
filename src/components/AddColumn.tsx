import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'

export function AddColumn() {
  const addColumn = useTasks((s) => s.addColumn)
  const [title, setTitle] = useState('')

  const handleAdd = () => {
    if (title.trim() === '') return
    addColumn(title)
    setTitle('')
  }

  return (
    <div className="p-2">
      <input
        className="border p-1 rounded mr-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Column title"
      />
      <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={handleAdd}>
        Add Column
      </button>
    </div>
  )
}

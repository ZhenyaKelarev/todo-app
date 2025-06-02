// src/components/Board.tsx
import { useTasks } from '@/hooks/useTasks'
import { Column } from './Column/Column'
import { AddColumn } from './AddColumn'

export function Board() {
  const columns = useTasks((s) => s.columns)

  return (
    <div className="p-4">
      <AddColumn />
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>
    </div>
  )
}

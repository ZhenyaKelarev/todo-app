import { useTasks } from "@/hooks/useTasks"
import { Column } from "./Column/Column"
import { AddColumn } from "./AddColumn"
import { useEffect, useRef } from "react"
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { calculateDropIndex } from "@/utils/calculateDropIndex"

export function Board() {
  const ref = useRef<HTMLDivElement | null>(null)
  const { columns, reorderColumns } = useTasks()

  useEffect(() => {
    if (!ref.current) return

    return dropTargetForElements({
      element: ref.current,
      canDrop: ({ source }) => source.data?.type === "column",
      getData: () => ({ type: "column-drop-target" }),
      onDrop: ({ source, location }) => {
        const sourceId = source.data.columnId as string
        const fromIndex = columns.findIndex((col) => col.id === sourceId)
        const toIndex = calculateDropIndex(ref.current!, sourceId)

        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          reorderColumns(fromIndex, toIndex)
        }
      },
    })
  }, [columns])

  return (
    <div>
      <AddColumn />
      <div className="flex gap-4 overflow-x-auto">
        {columns.map((col) => (
          <Column key={col.id} column={col} />
        ))}
      </div>
    </div>
  )
}

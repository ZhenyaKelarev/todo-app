import { create } from "zustand"
import { nanoid } from "nanoid"
import { Column, Task } from "@/types"
import { persist } from "zustand/middleware"

type StatusFilter = "all" | "completed" | "incomplete"

interface TaskState {
  tasks: Record<string, Task>
  columns: Column[]
  searchTerm: string
  statusFilter: StatusFilter
  setStatusFilter: (filter: StatusFilter) => void
  setSearchTerm: (term: string) => void
  addTask: (columnId: string, title: string) => void
  toggleComplete: (taskId: string) => void
  removeTask: (taskId: string) => void
  editTask: (taskId: string, newTitle: string) => void
  addColumn: (title: string) => void
  removeColumn: (columnId: string) => void
  selectTask: (taskId: string) => void
  selectAllInColumn: (columnId: string, selected: boolean) => void
  bulkDelete: () => void
  bulkToggleComplete: (complete: boolean) => void
  moveTaskToColumn: (
    taskId: string,
    toColumnId: string,
    toIndex: number
  ) => void
  reorderTaskInColumn: (
    columnId: string,
    fromIndex: number,
    toIndex: number
  ) => void
  reorderColumns: (fromIndex: number, toIndex: number) => void
}

export const useTasks = create<TaskState>()(
  persist(
    (set) => ({
      tasks: {},
      columns: [
        {
          id: "column-1",
          title: "To Do",
          taskIds: [],
        },
      ],
      searchTerm: "",
      statusFilter: "all",

      setSearchTerm: (term) => set({ searchTerm: term }),
      setStatusFilter: (filter) => set({ statusFilter: filter }),

      addTask: (columnId, title) =>
        set((state) => {
          const id = nanoid()
          const newTask: Task = {
            id,
            title,
            completed: false,
            selected: false,
          }

          return {
            tasks: {
              ...state.tasks,
              [id]: newTask,
            },
            columns: state.columns.map((col) =>
              col.id === columnId
                ? { ...col, taskIds: [...col.taskIds, id] }
                : col
            ),
          }
        }),

      toggleComplete: (taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              completed: !state.tasks[taskId].completed,
            },
          },
        })),

      removeTask: (taskId) =>
        set((state) => {
          const updatedColumns = state.columns.map((col) => ({
            ...col,
            taskIds: col.taskIds.filter((id) => id !== taskId),
          }))

          const { [taskId]: _, ...remainingTasks } = state.tasks

          return {
            tasks: remainingTasks,
            columns: updatedColumns,
          }
        }),

      editTask: (taskId, newTitle) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              title: newTitle,
            },
          },
        })),

      addColumn: (title) =>
        set((state) => {
          const id = nanoid()
          const newColumn: Column = {
            id,
            title,
            taskIds: [],
          }
          return {
            columns: [...state.columns, newColumn],
          }
        }),

      removeColumn: (columnId) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId)
          const taskIdsToRemove = column?.taskIds || []

          const newTasks = { ...state.tasks }
          for (const id of taskIdsToRemove) {
            delete newTasks[id]
          }

          return {
            columns: state.columns.filter((col) => col.id !== columnId),
            tasks: newTasks,
          }
        }),

      selectTask: (taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [taskId]: {
              ...state.tasks[taskId],
              selected: !state.tasks[taskId].selected,
            },
          },
        })),

      selectAllInColumn: (columnId, selected) =>
        set((state) => {
          const col = state.columns.find((c) => c.id === columnId)
          if (!col) return {}
          const updated = { ...state.tasks }

          for (const id of col.taskIds) {
            updated[id] = { ...updated[id], selected }
          }

          return { tasks: updated }
        }),

      bulkDelete: () =>
        set((state) => {
          const newTasks: typeof state.tasks = {}
          const newColumns = state.columns.map((col) => ({
            ...col,
            taskIds: col.taskIds.filter((id) => !state.tasks[id]?.selected),
          }))

          for (const [id, task] of Object.entries(state.tasks)) {
            if (!task.selected) newTasks[id] = task
          }

          return {
            tasks: newTasks,
            columns: newColumns,
          }
        }),

      bulkToggleComplete: (complete) =>
        set((state) => {
          const updated = { ...state.tasks }
          for (const [id, task] of Object.entries(state.tasks)) {
            if (task.selected) {
              updated[id] = { ...task, completed: complete }
            }
          }
          return { tasks: updated }
        }),

      moveTaskToColumn: (taskId: string, toColumnId: string, toIndex: number) =>
        set((state) => {
          // Знаходимо колонку, з якої забираємо таску
          const fromColumn = state.columns.find((col) =>
            col.taskIds.includes(taskId)
          )
          if (!fromColumn) return {}

          // Видаляємо таску з колонки джерела
          const newFromTaskIds = fromColumn.taskIds.filter(
            (id) => id !== taskId
          )

          // Вставляємо таску у колонку призначення на потрібну позицію
          const toColumn = state.columns.find((col) => col.id === toColumnId)
          if (!toColumn) return {}

          const newToTaskIds = [...toColumn.taskIds]
          newToTaskIds.splice(toIndex, 0, taskId)

          return {
            columns: state.columns.map((col) => {
              if (col.id === fromColumn.id) {
                return { ...col, taskIds: newFromTaskIds }
              }
              if (col.id === toColumnId) {
                return { ...col, taskIds: newToTaskIds }
              }
              return col
            }),
          }
        }),

      reorderTaskInColumn: (
        columnId: string,
        fromIndex: number,
        toIndex: number
      ) =>
        set((state) => {
          const column = state.columns.find((col) => col.id === columnId)
          if (!column) return {}

          const taskIds = [...column.taskIds]
          const [moved] = taskIds.splice(fromIndex, 1)
          taskIds.splice(toIndex, 0, moved)

          return {
            columns: state.columns.map((col) =>
              col.id === columnId ? { ...col, taskIds } : col
            ),
          }
        }),
      reorderColumns: (fromIndex: number, toIndex: number) =>
        set((state) => {
          const updated = [...state.columns]
          const [moved] = updated.splice(fromIndex, 1)
          updated.splice(toIndex, 0, moved)
          return { columns: updated }
        }),
    }),
    {
      name: "task-storage",
      partialize: (state) => ({
        tasks: state.tasks,
        columns: state.columns,
      }),
    }
  )
)

// src/hooks/useTasks.ts
import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { Column, Task } from '@/types'

interface TaskState {
  tasks: Record<string, Task>
  columns: Column[]
  addTask: (columnId: string, title: string) => void
  toggleComplete: (taskId: string) => void
  removeTask: (taskId: string) => void
  editTask: (taskId: string, newTitle: string) => void
  addColumn: (title: string) => void
  removeColumn: (columnId: string) => void
}

export const useTasks = create<TaskState>((set) => ({
  tasks: {},
  columns: [
    {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
    },
  ],

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
}))

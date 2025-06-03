import { useTasks } from "@/hooks/useTasks"

export const StatusFilter = () => {
  const { statusFilter, setStatusFilter } = useTasks()

  return (
    <div className="flex gap-2 py-4 text-sm">
      <button
        className={`px-2 py-1 rounded ${
          statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
        onClick={() => setStatusFilter("all")}
      >
        🔁 Усі
      </button>
      <button
        className={`px-2 py-1 rounded ${
          statusFilter === "completed"
            ? "bg-green-600 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => setStatusFilter("completed")}
      >
        ✅ Виконані
      </button>
      <button
        className={`px-2 py-1 rounded ${
          statusFilter === "incomplete"
            ? "bg-yellow-500 text-white"
            : "bg-gray-200"
        }`}
        onClick={() => setStatusFilter("incomplete")}
      >
        ❌ Не виконані
      </button>
    </div>
  )
}

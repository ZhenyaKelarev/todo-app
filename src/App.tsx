import { Board } from "./components/Board"
import { StatusFilter } from "./components/StatusFilter"
import { useTasks } from "./hooks/useTasks"

function App() {
  const { searchTerm, setSearchTerm } = useTasks()
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📝 Todo Board</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Пошук завдань..."
        className="px-3 py-1 border rounded w-64"
      />
      <StatusFilter />
      <Board />
    </div>
  )
}

export default App

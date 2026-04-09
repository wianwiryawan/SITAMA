import { useState } from "react";
import LoginForm from "./features/LoginForm";
import Navbar from "./components/layout/Navbar";
import TodoList from "./pages/ToDoList";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import type { User } from "./types/types";


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<'dashboard' | 'tasks' | 'calendar'>('dashboard');

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <Navbar
        currentPage={page}
        setCurrentPage={setPage}
        onLogout={() => setUser(null)}
      />

      <main className="max-w-7xl mx-auto p-10 pt-20">
        {page === 'dashboard' && <Dashboard user={user} />}
        {page === 'tasks' && <TodoList currentUser={user} />}
        {page === 'calendar' && <Calendar currentUser={user} />}
      </main>
    </div>
  );
}
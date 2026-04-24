import { useState } from "react";
import LoginForm from "./features/LoginForm";
import Navbar from "./components/layout/Navbar";
import TodoList from "./features/task/TaskManagement";
import Calendar from "./features/event/Calendar";
import Dashboard from "./features/Dashboard";
import type { User } from "./types/user";


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
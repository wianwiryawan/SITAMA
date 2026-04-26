interface Props {
  currentPage: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCurrentPage: (page: any) => void;
  onLogout: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, onLogout }: Props) {
  const menu = ['dashboard', 'tasks', 'calendar'];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#84342d] backdrop-blur-xl px-10 py-5 rounded-full flex gap-10 shadow-2xl z-50 border border-white/10 items-center">
      {menu.map(item => (
        <button
          key={item}
          onClick={() => setCurrentPage(item)}
          className={`text-xs font-black uppercase tracking-widest ${
            currentPage === item ? 'text-amber-400' : 'text-white'
          }`}
        >
          {item}
        </button>
      ))}

      <div className="w-px h-4 bg-gray-800 mx-2"></div>

      <button onClick={onLogout} className="text-xs font-black uppercase text-red-500">
        Exit
      </button>
    </nav>
  );
}
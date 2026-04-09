export default function Dashboard({ user }: { user: any }) {
  return (
    <div className="animate-in fade-in duration-700">
      <p className="text-3xl font-black text-gray-400">Welcome</p>
      <h1 className="text-7xl font-black tracking-tighter italic leading-none mb-6 text-gray-950">
        {user?.username}
      </h1>
    </div>
  );
}
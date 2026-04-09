export const mainStyles = {
  container: "min-h-screen bg-gray-50 flex items-center justify-center p-6",
  card: "w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100",
  title: "text-4xl font-black tracking-tighter text-center text-gray-950",
  input: "w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-sm border focus:border-indigo-500 transition-all",
  button: "w-full bg-gray-950 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl",
  error: "text-[10px] font-black text-red-500 uppercase tracking-widest text-center",
  footer: "text-center mt-8 text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]"
};

export const buttonStyles = {
  base: "w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all",
}

export const buttonVariants = {
  primary: "bg-gray-950 text-white hover:bg-indigo-600 shadow-xl",
  secondary: "text-gray-400",
  danger: "bg-red-500 text-white hover:bg-red-600",
}

export const tableStyles = {
  container: "mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200",
}
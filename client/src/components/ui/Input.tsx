interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className={`w-full bg-gray-50 p-5 rounded-2xl outline-none font-bold text-sm border focus:border-indigo-500 transition-all ${props.className}`}
    />
  );
}
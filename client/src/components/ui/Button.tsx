import { buttonStyles, buttonVariants } from "../../styles/theme";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: Props) {
  
  return (
    <button
      {...props}
      className={`${buttonStyles.base} ${buttonVariants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
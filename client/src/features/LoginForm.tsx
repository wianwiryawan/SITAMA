/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { User } from "../types/user";
import Input from "../components/ui/Input";
import { mainStyles } from "../styles/theme";
import { loginUser } from "../api/auth";

interface Props {
  onLogin: (user: User) => void;
}

export default function LoginForm({ onLogin }: Props) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  const fd = new FormData(e.currentTarget);
  const usernameInput = fd.get('name') as string;
  const passwordInput = fd.get('pass') as string;

  try {
    const data = await loginUser({ 
      username: usernameInput, 
      password: passwordInput 
    });

    console.log("cek role", data.user.role);

    onLogin(data.user); 

  } catch (err: any) {
    const message = err.response?.data?.message || "Gagal terhubung ke server";
    setError(message);
    console.error("Login Error:", err);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={mainStyles.container}>
      <div className={mainStyles.card}>
        <h1 className={`${mainStyles.title} mb-3`}>SITAMA</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input name="name" required placeholder="Username" disabled={isLoading} />
          <Input name="pass" type="password" required placeholder="Password" disabled={isLoading} />
          {error && <p className={mainStyles.error}>{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`${mainStyles.button} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className={mainStyles.footer}>SIAK Access Only</p>
      </div>
    </div>
  );
}
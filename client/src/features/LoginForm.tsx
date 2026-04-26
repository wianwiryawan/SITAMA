/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { User } from "../types/user";
import Input from "../components/ui/Input";
// import { mainStyles } from "../styles/theme";
import { loginUser } from "../api/auth";
import sitamaImg from "./SITAMA.png";
import { bgStyles } from "../styles/theme";

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
    <div className={`${bgStyles.login} min-h-screen flex items-center justify-center`}>
      <div className="w-7xl h-120 bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-3">
    <div className="col-span-2 aspect-video">
      <img
        src={sitamaImg}
        className="w-full h-full object-contain"
      />
    </div>
    <div className="col-span-1 flex flex-col justify-center px-8">
      <h1 className="text-2xl font-bold mb-3">Welcome!</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input name="name" required placeholder="Username" disabled={isLoading} />
        <Input name="pass" type="password" required placeholder="Password" disabled={isLoading} />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-2 rounded-lg bg-amber-500 text-white font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* <p className="text-sm text-gray-400 mt-6">SIAK Access Only</p> */}
    </div>

  </div>
</div>
  );
}
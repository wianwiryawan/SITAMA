import { useState } from "react";
import type { User } from "../types/user";
import Input from "../components/ui/Input";
import { mainStyles } from "../styles/theme";

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
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: usernameInput,
          password: passwordInput 
        }),
      });
      console.log("ini pass"+passwordInput);

      const data = await response.json();

      if (response.ok) {
        // Simpan Token JWT ke LocalStorage
        localStorage.setItem('token', data.token);
        console.log("token jwt", data.token);

        // Kirim data user ke State Utama 
        onLogin(data.user); 
      } else {
        setError(data.message || "Username atau Password salah");
      }
    } catch (err) {
      setError("Gagal terhubung ke server backend");
      console.error(err);
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
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
        <p className={mainStyles.footer}>SIAK Access Only</p>
      </div>
    </div>
  );
}
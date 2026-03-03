import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type LoginProps = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Login({ setIsAuthenticated }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-violet-200 via-violet-400 to-violet-200 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border-neutral-800 border-6 bg-neutral-200 p-8 max-w-md mx-auto absolute color-slate shadow-2xl"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <button className="bg-stone-900 text-white hover:bg-violet-400 px-4 py-2 w-full">
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="bg-stone-900 text-white hover:bg-violet-400 px-4 py-2 gap-y-4 w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}

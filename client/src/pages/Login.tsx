import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hunters.svg";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-neutral-100 via-50% to-blue-200 flex flex-col items-center justify-center gap-6">
      <img src={logo} className="w-40 h-40" />

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border-neutral-800 border-2 bg-neutral-200 p-8 max-w-md w-full shadow-2xl"
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

        <button className="bg-stone-900 text-white hover:bg-blue-300 hover:text-black hover:border-2 hover:border-black px-4 py-2 w-full">
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="bg-stone-900 text-white hover:bg-blue-300 hover:text-black hover:border-2 hover:border-black px-4 py-2 w-full mt-3"
        >
          Register
        </button>
      </form>
    </div>
  );
}

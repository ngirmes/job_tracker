import { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/hunters.svg";

type NavbarProps = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Navbar({ setIsAuthenticated }: NavbarProps) {
  const navigate = useNavigate();

  async function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <>
      <header className="fixed z-50 w-full border-b-2 border-black bg-neutral-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
          <button onClick={() => navigate("/dashboard")}>
            <img src={logo} className="w-16 h-16 cursor-pointer" />
          </button>
          <Link to="/profile" className="hover:text-blue-400">
            Profile
          </Link>
          <Link to="/subscriptions" className="hover:text-blue-400">
            Subscriptions
          </Link>
          <Link to="/ads" className="hover:text-blue-400">
            Job search
          </Link>
          <Link
            to="/login"
            onClick={() => logout()}
            className="hover:text-blue-400"
          >
            Logout
          </Link>
        </div>
      </header>
    </>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/hunters.svg";

type NavbarProps = {
  setIsAuthenticated: (value: boolean) => void;
};

export default function Navbar({ setIsAuthenticated }: NavbarProps) {
  const navigate = useNavigate();
  const [navDropdown, setNavDropdown] = useState(false);

  async function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <>
      <header className="w-full border-b border-neutral-300 p-4 bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate("/dashboard")}>
            <img src={logo} className="w-16 h-16 cursor-pointer" />
          </button>
          <div className="text-sm text-neutral-600">
            Nicholas Girmes • email@example.com
          </div>
          <div className="relative">
            <button
              onClick={() => setNavDropdown((prev) => !prev)}
              className="hover:text-blue-300"
            >
              <Menu size={36} />
            </button>

            {navDropdown && (
              <div className="absolute grid grid-flow-col grid-rows-4 bg-neutral-200 border-2 border-black p-2 ">
                <Link to="/profile" className="hover:text-sky-500">
                  Profile
                </Link>
                <Link to="/subscriptions" className="hover:text-sky-500">
                  Subscriptions
                </Link>
                <Link to="/jobsearch" className="hover:text-sky-500">
                  Job search
                </Link>
                <Link
                  to="/login"
                  onClick={() => logout()}
                  className="hover:text-sky-500"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

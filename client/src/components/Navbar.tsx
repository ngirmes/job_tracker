import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

export default function Navbar() {
  const [navDropdown, setNavDropdown] = useState(false);

  return (
    <>
      <header className="w-full border-b border-neutral-300 p-4 bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg">Job Tracker</h1>
          <div className="text-sm text-neutral-600">
            Nicholas Girmes • email@example.com
          </div>
          <div className="relative">
            <button onClick={() => setNavDropdown((prev) => !prev)}>
              <Menu size={24} />
            </button>

            {navDropdown && (
              <div className="absolute grid grid-flow-col grid-rows-3 bg-neutral-200 border-2 border-black p-2 ">
                <Link to="/profile" className="hover:text-sky-500">
                  Profile
                </Link>
                <Link to="/subscriptions" className="hover:text-sky-500">
                  Subscriptions
                </Link>
                <Link to="/jobsearch" className="hover:text-sky-500">
                  Job search
                </Link>
                <Link to="/jobsearch" className="hover:text-sky-500">
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

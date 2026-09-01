import { useNavigate } from "react-router-dom";
import { clearSession } from "../services/auth.js";

export default function Header({ title, name, onMenu }) {
  const navigate = useNavigate();

  function logout() {
    clearSession();
    navigate("/");
  }

  return (
    <header className="bg-cat-black text-white sticky top-0 z-20">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onMenu && (
            <button
              onClick={onMenu}
              className="md:hidden text-2xl leading-none px-2"
              aria-label="Menu"
            >
              ☰
            </button>
          )}
          <div className="bg-cat-yellow text-cat-black font-black px-2 py-1 rounded">
            CAT
          </div>
          <h1 className="font-bold text-sm sm:text-lg">{title}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {name && <span className="hidden sm:inline text-gray-300">{name}</span>}
          <button
            onClick={logout}
            className="bg-cat-yellow text-cat-black font-semibold px-3 py-1 rounded hover:brightness-95"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

import { useNavigate } from "react-router-dom";
import { clearSession } from "../services/auth.js";
import Icon from "./Icon.jsx";

export default function Header({ title, subtitle, name, role, onMenu }) {
  const navigate = useNavigate();

  function logout() {
    clearSession();
    navigate("/");
  }

  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenu && (
            <button
              onClick={onMenu}
              className="rounded-lg p-1.5 text-stone-600 hover:bg-stone-100 md:hidden"
              aria-label="Toggle menu"
            >
              <Icon name="menu" />
            </button>
          )}
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-cat-ink font-display text-sm font-extrabold text-cat-yellow">
            CAT
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold tracking-tight text-stone-900 sm:text-[15px]">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-stone-500">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-stone-900 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-stone-900">{name}</p>
              {role && (
                <p className="text-[11px] uppercase tracking-wide text-stone-400">
                  {role}
                </p>
              )}
            </div>
          </div>
          <button onClick={logout} className="btn btn-ghost btn-sm">
            <Icon name="logout" className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

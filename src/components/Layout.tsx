import { Outlet, NavLink } from "react-router-dom";
import { Home, BookOpen, ShoppingCart } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Hem" },
  { to: "/learnings", icon: BookOpen, label: "Lärdomar" },
  { to: "/shopping", icon: ShoppingCart, label: "Inköp" },
] as const;

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 safe-area-pb">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-2 text-xs transition-colors ${
                  isActive ? "text-wood-700 font-semibold" : "text-slate-400"
                }`
              }
            >
              <Icon size={22} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

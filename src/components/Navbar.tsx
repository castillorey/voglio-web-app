import { cn } from "@/lib/utils";
import { User, Users, LayoutGrid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { title: "Voglios", href: "/collections", icon: LayoutGrid },
  { title: "Friends", href: "/friends", icon: Users },
  { title: "Profile", href: "/account", icon: User },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (href: string) => {
    if (href === "/collections") return pathname === "/" || pathname.startsWith("/collections");
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 rounded-full bg-white/75 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-5 py-2 rounded-full transition-all duration-300",
                active
                  ? "bg-gradient-to-b from-gray-500 to-gray-600 shadow-md shadow-gray-500/30"
                  : "hover:bg-black/5"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  active ? "text-white" : "text-gray-500"
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-medium tracking-tight transition-colors duration-300",
                  active ? "text-white" : "text-gray-500"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
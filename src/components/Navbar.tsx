import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Plus, Heart, User } from "lucide-react";
import CreateDialog from "./CreateDialog";

export default function Navbar() {
  const { pathname } = useLocation();
  const [createOpen, setCreateOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return (
        pathname === "/" ||
        pathname.startsWith("/category") ||
        pathname.startsWith("/voglio")
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md h-16 bg-white/90 backdrop-blur-md rounded-full border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-6 flex items-center justify-between">
      {/* Home */}
      <Link
        to="/"
        className={cn(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300",
          isActive("/")
            ? "bg-[#F1EEFF] text-[#7B61FF]"
            : "text-[#8C8F9E] hover:text-[#1B1B2D]"
        )}
      >
        <Home className="w-5 h-5" strokeWidth={1.8} />
      </Link>

      {/* Friends */}
      <Link
        to="/friends"
        className={cn(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300",
          isActive("/friends")
            ? "bg-[#F1EEFF] text-[#7B61FF]"
            : "text-[#8C8F9E] hover:text-[#1B1B2D]"
        )}
      >
        <Users className="w-5 h-5" strokeWidth={1.8} />
      </Link>

      {/* Create / Plus */}
      <button
        onClick={() => setCreateOpen(true)}
        className="w-11 h-11 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-[#00F2FE] via-[#4FACFE] to-[#F355FF]">
          <div className="bg-white rounded-full w-9 h-9 flex items-center justify-center">
            <Plus className="w-5 h-5 text-[#2D3142]" strokeWidth={2.5} />
          </div>
        </div>
      </button>

      {/* Heart (Placeholder / No-op) */}
      <div
        className={cn(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 text-[#8C8F9E]"
        )}
      >
        <Heart className="w-5 h-5" strokeWidth={1.8} />
      </div>

      {/* Profile */}
      <Link
        to="/account"
        className={cn(
          "w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300",
          isActive("/account")
            ? "bg-[#F1EEFF] text-[#7B61FF]"
            : "text-[#8C8F9E] hover:text-[#1B1B2D]"
        )}
      >
        <User className="w-5 h-5" strokeWidth={1.8} />
      </Link>

      <CreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </nav>
  );
}

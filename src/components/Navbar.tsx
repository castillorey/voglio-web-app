import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { title: "Voglios", href: "/" },
  { title: "Friends", href: "/friends" },
  { title: "Profile", href: "/account" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (href: string) => {
    if (href === "/")
      return (
        pathname === "/" ||
        pathname.startsWith("/collections") ||
        pathname.startsWith("/category") ||
        pathname.startsWith("/voglio")
      );
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-4 z-50 flex justify-center">
      <div className="flex bg-[#F1F2F6] p-1 rounded-full gap-1 shadow-sm">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                "px-5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                active
                  ? "text-[#7B61FF] bg-white shadow-sm"
                  : "text-[#8C8F9E] hover:text-[#1B1B2D]"
              )}
              style={
                active
                  ? { boxShadow: "0 2px 8px rgba(123, 97, 255, 0.08)" }
                  : undefined
              }
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

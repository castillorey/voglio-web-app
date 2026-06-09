import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { User, Users } from "lucide-react";
import { Link } from "react-router-dom";

const navigationMenuItems = [
  // { title: "Voglios", href: "/", icon: LayoutGrid },
  { title: "My Collections", href: "/collections", icon: Users },
  { title: "Friends", href: "/friends", icon: Users },
  { title: "Account", href: "/account", icon: User },
];

export default function Navbar() {
  return (
    <NavigationMenu className="h-[70px] max-w-full fixed bottom-0 left-0 w-full bg-white">
      <NavigationMenuList>
        {navigationMenuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "flex flex-col h-auto items-center px-5 py-2.5"
              )}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mb-1.5 h-5 w-5" />
                {item.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
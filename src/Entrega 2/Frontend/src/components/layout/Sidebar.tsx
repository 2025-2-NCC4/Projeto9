import {
  LayoutDashboard,
  Users,
  Store,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Visão Geral", path: "/" },
  { icon: DollarSign, label: "Financeiro", path: "/financeiro" },
  { icon: Users, label: "Clientes", path: "/cliente" },
  { icon: Store, label: "Lojas", path: "/lojas" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-md">
            <TrendingUp className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PicBoard</h1>
            <p className="text-xs text-muted-foreground">
              Analytics Corporativo
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

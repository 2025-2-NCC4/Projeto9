import { Search, TrendingUp } from "lucide-react";
import { UserProfile } from "./UserProfile";
import { SearchCommand } from "./SearchCommand";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <Link to="/" className="flex items-center gap-3 md:hidden">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-md">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div> 
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            className="relative flex-1 flex items-center gap-3 px-4 py-2 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors text-left group"
          >
            <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm text-muted-foreground">Buscar análises, lojas, clientes...</span>
            <kbd className="hidden md:inline-flex items-center gap-1 ml-auto px-2 py-1 text-xs font-mono bg-muted rounded">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <UserProfile />
        </div>
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

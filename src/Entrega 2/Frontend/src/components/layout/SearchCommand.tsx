import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { LayoutDashboard, DollarSign, Users, Store, Search, TrendingUp, Percent } from "lucide-react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Visão Geral", path: "/", keywords: ["dashboard", "home", "início"] },
  { icon: DollarSign, label: "Financeiro", path: "/financeiro", keywords: ["receita", "cupons", "repasse", "ticket"] },
  { icon: Users, label: "Clientes", path: "/cliente", keywords: ["usuários", "zona", "bairro", "localização"] },
  { icon: Store, label: "Lojas", path: "/lojas", keywords: ["estabelecimentos", "parceiros", "segmentos"] },
];

const quickSearches = [
  // Financeiro
  { icon: DollarSign, label: "Receita Total", keywords: ["receita", "total", "valor"], path: "/financeiro" },
  { icon: DollarSign, label: "Receita Líquida", keywords: ["líquida", "net", "lucro"], path: "/financeiro" },
  { icon: DollarSign, label: "Ticket Médio", keywords: ["ticket", "médio", "average"], path: "/financeiro" },
  { icon: TrendingUp, label: "Receita por Tipo de Cupom", keywords: ["cupom", "tipo", "categorias"], path: "/financeiro" },
  { icon: TrendingUp, label: "Participação por Período", keywords: ["participação", "período", "temporal"], path: "/financeiro" },
  { icon: TrendingUp, label: "Participação por Dia da Semana", keywords: ["dia", "semana", "semanal"], path: "/financeiro" },
  { icon: TrendingUp, label: "Receita e Cupons por Período", keywords: ["receita", "cupons", "período"], path: "/financeiro" },
  { icon: TrendingUp, label: "Análise de Receita por Dia", keywords: ["receita", "dia", "diário", "diária"], path: "/financeiro" },
  
  // Visão Geral
  { icon: Percent, label: "Margem Operacional", keywords: ["margem", "operacional", "percentual"], path: "/" },
  { icon: TrendingUp, label: "Análise de Receita Temporal", keywords: ["temporal", "mensal", "período"], path: "/" },
  
  // Clientes
  { icon: Users, label: "Total de Usuários", keywords: ["total", "usuários", "clientes"], path: "/cliente" },
  { icon: Users, label: "Usuários Ativos", keywords: ["usuários", "ativos", "clientes"], path: "/cliente" },
  { icon: Users, label: "Taxa de Retenção", keywords: ["retenção", "taxa", "usuários"], path: "/cliente" },
  { icon: Users, label: "Principais Categorias Frequentadas", keywords: ["categorias", "frequentadas", "preferências"], path: "/cliente" },
  { icon: Users, label: "Usuários por Zona", keywords: ["zona", "região", "localização"], path: "/cliente" },
  { icon: Users, label: "Top 10 Bairros por Usuários", keywords: ["bairros", "top", "localização"], path: "/cliente" },
  { icon: Users, label: "Retenção de Usuários", keywords: ["retenção", "usuários", "fidelização"], path: "/cliente" },
  
  // Lojas
  { icon: Store, label: "Total de Parceiros", keywords: ["parceiros", "lojas", "estabelecimentos", "total"], path: "/lojas" },
  { icon: Store, label: "Receita Média/Parceiro", keywords: ["receita", "média", "parceiro"], path: "/lojas" },
  { icon: Store, label: "Total Segmentos", keywords: ["segmentos", "categorias", "setores"], path: "/lojas" },
  { icon: Store, label: "Ranking de Parceiros", keywords: ["ranking", "top", "parceiros"], path: "/lojas" },
  { icon: Store, label: "Top Lojas Parceiras", keywords: ["top", "melhores", "lojas"], path: "/lojas" },
  { icon: Store, label: "Receita por Segmento", keywords: ["segmento", "categoria", "setor", "receita"], path: "/lojas" },
  { icon: Store, label: "Análise por Segmento", keywords: ["análise", "segmento", "detalhada"], path: "/lojas" },
];

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchCommand = ({ open, onOpenChange }: SearchCommandProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
    setSearch("");
  };

  const filteredNavigation = navigationItems.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.keywords.some((keyword) => keyword.includes(searchLower))
    );
  });

  const filteredQuickSearches = quickSearches.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.keywords.some((keyword) => keyword.includes(searchLower))
    );
  });

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Buscar páginas, análises e métricas..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        <CommandGroup heading="Navegação">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.path}
                onSelect={() => handleSelect(item.path)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {search && filteredQuickSearches.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Buscas Rápidas">
              {filteredQuickSearches.map((item, index) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSelect(item.path)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        Ver análise detalhada
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { kpisService } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";

export const TopStoresTable = () => {
  const { data: parceirosData, isLoading } = useQuery({
    queryKey: ['parceiros'],
    queryFn: () => kpisService.getTotalParceiros({ limit: 10, sort: 'total', order: 'desc' }),
  });

  if (isLoading) {
    return (
      <Card className="p-6 shadow-soft">
        <Skeleton className="h-[400px]" />
      </Card>
    );
  }

  const stores = parceirosData?.parceiros || [];
  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Top Lojas Parceiras</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Lojas com maior receita no período
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loja</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Receita</TableHead>
            <TableHead className="text-right">Variação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{store.nome_estabelecimento}</TableCell>
              <TableCell>
                <Badge variant="secondary">{store.total_ocorrencias} cupons</Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                R$ {store.total_valor_cupom.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-muted-foreground text-sm">
                    Média: R$ {store.media_valor_cupom.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

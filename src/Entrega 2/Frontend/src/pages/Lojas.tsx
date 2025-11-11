import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Store, TrendingUp, Award, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { kpisService, FilterParams } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { SortFilter } from "@/components/filters/SortFilter";
import { useState } from "react";
import { kpiInfo } from "@/lib/kpiInfo";

export default function Lojas() {
  const [filters, setFilters] = useState<FilterParams>({
    sort: 'total',
    order: 'desc',
  });

  const { data: receitaTotal } = useQuery({
    queryKey: ['receita-total'],
    queryFn: kpisService.getReceitaTotal,
  });

  const { data: segmentos, isLoading: loadingSegmentos } = useQuery({
    queryKey: ['segmentos', filters],
    queryFn: () => kpisService.getTotalSegmentos(filters),
  });

  const { data: parceiros, isLoading: loadingParceiros } = useQuery({
    queryKey: ['parceiros', filters],
    queryFn: () => kpisService.getTotalParceiros(filters),
  });

  const handleDateChange = (start: string | undefined, end: string | undefined) => {
    setFilters(prev => ({ ...prev, start, end }));
  };

  const handleSortChange = (sort: string, order: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sort, order }));
  };

  const totalParceiros = parceiros?.parceiros?.length || 0;
  const totalSegmentos = segmentos?.seguimentos?.length || 0;
  const receitaMediaParceiro = parceiros?.parceiros?.reduce((sum, p) => sum + p.media_valor_cupom, 0) / (totalParceiros || 1) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Lojas Parceiras</h1>
          <p className="text-muted-foreground mt-2">
            Análise de desempenho das lojas parceiras
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Parceiros"
            value={totalParceiros.toString()}
            change={receitaTotal?.variacao_percent || 0}
            icon={Store}
            trend={receitaTotal?.trend || "up"}
          />
          <MetricCard
            title="Receita Média/Parceiro"
            value={`R$ ${receitaMediaParceiro.toFixed(2)}`}
            change={9.3}
            icon={TrendingUp}
            trend="up"
            infoDescription={kpiInfo.receita_media_parceiro.long}
            infoFormula={kpiInfo.receita_media_parceiro.formula}
          />
          <MetricCard
            title="Total Segmentos"
            value={totalSegmentos.toString()}
            change={5.7}
            icon={Award}
            trend="up"
          />
          <MetricCard
            title="Receita Total"
            value={`R$ ${((receitaTotal?.total_valor_cupom || 0) / 1000000).toFixed(2)}M`}
            change={receitaTotal?.variacao_percent || 0}
            icon={TrendingUp}
            trend={receitaTotal?.trend || "up"}
            infoDescription={kpiInfo.receita_total.long}
            infoFormula={kpiInfo.receita_total.formula}
          />
        </div>

        <Tabs defaultValue="parceiros" className="space-y-6">
          <TabsList>
            <TabsTrigger value="parceiros">Parceiros</TabsTrigger>
            <TabsTrigger value="segmentos">Segmentos</TabsTrigger>
          </TabsList>

          <TabsContent value="parceiros" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Ranking de Parceiros</h3>
                <div className="flex gap-3">
                  <DateRangeFilter onDateChange={handleDateChange} />
                  <SortFilter
                    options={[
                      { value: 'total-desc', label: 'Total Valor (Maior)' },
                      { value: 'total-asc', label: 'Total Valor (Menor)' },
                      { value: 'media-desc', label: 'Média (Maior)' },
                      { value: 'media-asc', label: 'Média (Menor)' },
                      { value: 'qtd-desc', label: 'Quantidade (Maior)' },
                      { value: 'qtd-asc', label: 'Quantidade (Menor)' },
                      { value: 'nome-asc', label: 'Nome (A-Z)' },
                      { value: 'nome-desc', label: 'Nome (Z-A)' },
                    ]}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>

              {loadingParceiros ? (
                <Skeleton className="h-96" />
              ) : parceiros && parceiros.parceiros.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parceiro</TableHead>
                      <TableHead className="text-right">Ocorrências</TableHead>
                      <TableHead className="text-right">Total Cupom</TableHead>
                      <TableHead className="text-right">Média Cupom</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parceiros.parceiros.map((parceiro, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{parceiro.nome_estabelecimento}</TableCell>
                        <TableCell className="text-right">{parceiro.total_ocorrencias.toLocaleString()}</TableCell>
                        <TableCell className="text-right">R$ {parceiro.total_valor_cupom.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">R$ {parceiro.media_valor_cupom.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="segmentos" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Análise por Segmento</h3>
                <div className="flex gap-3">
                  <DateRangeFilter onDateChange={handleDateChange} />
                  <SortFilter
                    options={[
                      { value: 'total-desc', label: 'Total Valor (Maior)' },
                      { value: 'total-asc', label: 'Total Valor (Menor)' },
                      { value: 'media-desc', label: 'Média (Maior)' },
                      { value: 'media-asc', label: 'Média (Menor)' },
                      { value: 'qtd-desc', label: 'Quantidade (Maior)' },
                      { value: 'qtd-asc', label: 'Quantidade (Menor)' },
                      { value: 'nome-asc', label: 'Nome (A-Z)' },
                      { value: 'nome-desc', label: 'Nome (Z-A)' },
                    ]}
                    onSortChange={handleSortChange}
                  />
                </div>
              </div>

              {loadingSegmentos ? (
                <Skeleton className="h-96" />
              ) : segmentos && segmentos.seguimentos.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Ocorrências</TableHead>
                      <TableHead className="text-right">Total Cupom</TableHead>
                      <TableHead className="text-right">Média Cupom</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segmentos.seguimentos.map((segmento, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{segmento.categoria_estabelecimento}</TableCell>
                        <TableCell className="text-right">{segmento.total_ocorrencias.toLocaleString()}</TableCell>
                        <TableCell className="text-right">R$ {segmento.total_valor_cupom.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">R$ {segmento.media_valor_cupom.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

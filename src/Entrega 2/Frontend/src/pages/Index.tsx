import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { TopStoresTable } from "@/components/dashboard/TopStoresTable";
import { DollarSign, TrendingUp, Percent, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { kpisService } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";
import { kpiInfo } from "@/lib/kpiInfo";

const Index = () => {
  const { data: receitaTotal, isLoading: loadingReceita } = useQuery({
    queryKey: ['receita-total'],
    queryFn: kpisService.getReceitaTotal,
  });

  const { data: receitaLiquida, isLoading: loadingLiquida } = useQuery({
    queryKey: ['receita-liquida'],
    queryFn: kpisService.getReceitaLiquida,
  });

  const { data: usuarios, isLoading: loadingUsuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: kpisService.getUsuarios,
  });

  const { data: ticketMedio } = useQuery({
    queryKey: ['ticket-medio'],
    queryFn: kpisService.getTicketMedio,
  });

  const margemOperacional = receitaTotal && receitaLiquida 
    ? (receitaLiquida.receita_liquida / receitaTotal.total_valor_cupom) * 100 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
          <p className="text-muted-foreground mt-1">
            Análise completa de performance e métricas financeiras
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingReceita ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              title="Receita Total"
              value={`R$ ${((receitaTotal?.total_valor_cupom || 0) / 1000000).toFixed(2)}M`}
              change={receitaTotal?.variacao_percent || 0}
              icon={DollarSign}
              trend={receitaTotal?.trend || "up"}
              infoDescription={kpiInfo.receita_total.long}
              infoFormula={kpiInfo.receita_total.formula}
            />
          )}
          
          {loadingLiquida ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              title="Receita Líquida"
              value={`R$ ${((receitaLiquida?.receita_liquida || 0) / 1000000).toFixed(2)}M`}
              change={receitaLiquida?.variacao_percent || 0}
              icon={TrendingUp}
              trend={receitaLiquida?.trend || "up"}
              infoDescription={kpiInfo.receita_liquida.long}
              infoFormula={kpiInfo.receita_liquida.formula}
            />
          )}
          
          <MetricCard
            title="Margem Operacional"
            value={`${margemOperacional.toFixed(1)}%`}
            change={2.3}
            icon={Percent}
            trend="up"
            infoDescription={kpiInfo.margem_operacional.long}
            infoFormula={kpiInfo.margem_operacional.formula}
          />
          
          {loadingUsuarios ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              title="Total de Usuários"
              value={(usuarios?.total_usuarios || 0).toLocaleString()}
              change={usuarios?.variacao_percent || 0}
              icon={Users}
              trend={usuarios?.trend || "up"}
              infoDescription={kpiInfo.total_usuarios.long}
              infoFormula={kpiInfo.total_usuarios.formula}
            />
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="temporal">Análise Temporal</TabsTrigger>
            <TabsTrigger value="segments">Segmentos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <CategoryChart />
            </div>
            <TopStoresTable />
          </TabsContent>

          <TabsContent value="temporal" className="space-y-6">
            <RevenueChart />
            <CategoryChart />
            <TopStoresTable />
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <CategoryChart />
              <TopStoresTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Index;

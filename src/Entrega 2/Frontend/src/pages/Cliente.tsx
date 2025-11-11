import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Users, ShoppingBag, TrendingUp, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { kpisService } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LocationZoneChart } from "@/components/dashboard/LocationZoneChart";
import { LocationBairroChart } from "@/components/dashboard/LocationBairroChart";
import { kpiInfo } from "@/lib/kpiInfo";

export default function Cliente() {
  const { data: usuarios, isLoading: loadingUsuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: kpisService.getUsuarios,
  });

  const { data: ticketMedio, isLoading: loadingTicket } = useQuery({
    queryKey: ['ticket-medio'],
    queryFn: kpisService.getTicketMedio,
  });

  const { data: principaisCategorias } = useQuery({
    queryKey: ['principais-categorias'],
    queryFn: kpisService.getPrincipaisCategorias,
  });

  const { data: retencao } = useQuery({
    queryKey: ['retencao'],
    queryFn: kpisService.getRetencao,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Clientes</h1>
          <p className="text-muted-foreground mt-2">
            Análise de comportamento e métricas de clientes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loadingUsuarios ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              title="Total de Usuários"
              value={(usuarios?.total_usuarios || 0).toLocaleString()}
              change={usuarios?.variacao_percent || 0}
              icon={Users}
              trend={usuarios?.trend || "up"}
            />
          )}

          {loadingTicket ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              title="Ticket Médio"
              value={`R$ ${(ticketMedio?.ticket_medio || 0).toFixed(2)}`}
              change={7.8}
              icon={TrendingUp}
              trend="up"
              infoDescription={kpiInfo.ticket_medio.long}
              infoFormula={kpiInfo.ticket_medio.formula}
            />
          )}

          <MetricCard
            title="Taxa de Retenção"
            value={`${(retencao?.retencao_percentual || 0).toFixed(1)}%`}
            change={3.2}
            icon={Award}
            trend="up"
            infoDescription={kpiInfo.taxa_retencao.long}
            infoFormula={kpiInfo.taxa_retencao.formula}
          />

          <MetricCard
            title="Usuários Ativos"
            value={(usuarios?.mes_atual || 0).toLocaleString()}
            change={usuarios?.variacao_percent || 0}
            icon={ShoppingBag}
            trend={usuarios?.trend || "up"}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Principais Categorias Frequentadas</h3>
              {principaisCategorias && principaisCategorias.principais_categorias.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Total Usuários</TableHead>
                      <TableHead className="text-right">Pegou Cupom</TableHead>
                      <TableHead className="text-right">% Cupom</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {principaisCategorias.principais_categorias.map((categoria, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{categoria.categoria_frequentada}</TableCell>
                        <TableCell className="text-right">{categoria.total_usuarios.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{categoria.total_pegou_cupom.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{categoria.percentual_cupom.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Carregando dados...</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="localizacao" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LocationZoneChart />
              <LocationBairroChart />
            </div>
            
            <Card className="p-6 shadow-soft">
              <h3 className="text-lg font-semibold mb-4">Retenção de Usuários</h3>
              {retencao ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Usuários Período Anterior</p>
                      <p className="text-2xl font-bold">{retencao.usuarios_prev.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Usuários Período Atual</p>
                      <p className="text-2xl font-bold">{retencao.usuarios_cur.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary">
                      <p className="text-sm text-muted-foreground">Usuários Retidos</p>
                      <p className="text-2xl font-bold">{retencao.usuarios_retidos.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                      <p className="text-sm text-muted-foreground">Taxa de Retenção</p>
                      <p className="text-2xl font-bold text-primary">{retencao.retencao_percentual.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Carregando dados...</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

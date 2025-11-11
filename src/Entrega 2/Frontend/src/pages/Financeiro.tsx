import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DollarSign, TrendingUp, Percent, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyRevenueChart } from "@/components/dashboard/MonthlyRevenueChart";
import { useQuery } from "@tanstack/react-query";
import { kpisService } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { kpiInfo } from "@/lib/kpiInfo";

export default function Financeiro() {
  const { data: receitaTotal, isLoading: loadingReceita } = useQuery({
    queryKey: ['receita-total'],
    queryFn: kpisService.getReceitaTotal,
  });

  const { data: receitaLiquida, isLoading: loadingLiquida } = useQuery({
    queryKey: ['receita-liquida'],
    queryFn: kpisService.getReceitaLiquida,
  });

  const { data: ticketMedio, isLoading: loadingTicket } = useQuery({
    queryKey: ['ticket-medio'],
    queryFn: kpisService.getTicketMedio,
  });

  const { data: receitaPorCupom } = useQuery({
    queryKey: ['receita-por-cupom'],
    queryFn: kpisService.getReceitaPorCupom,
  });

  const { data: participacaoPorPeriodo } = useQuery({
    queryKey: ['participacao-periodo'],
    queryFn: kpisService.getParticipacaoPorPeriodo,
  });

  const { data: participacaoDiaria } = useQuery({
    queryKey: ['participacao-diaria'],
    queryFn: kpisService.getParticipacaoDiaria,
  });

  const margemMedia = receitaTotal && receitaLiquida 
    ? ((receitaLiquida.receita_liquida / receitaTotal.total_valor_cupom) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground mt-2">
            Análise detalhada das métricas financeiras
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

          {loadingTicket ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              title="Ticket Médio"
              value={`R$ ${(ticketMedio?.ticket_medio || 0).toFixed(2)}`}
              change={7.8}
              icon={CreditCard}
              trend="up"
              infoDescription={kpiInfo.ticket_medio.long}
              infoFormula={kpiInfo.ticket_medio.formula}
            />
          )}

          <MetricCard
            title="Margem Operacional"
            value={`${margemMedia.toFixed(1)}%`}
            change={2.1}
            icon={Percent}
            trend="up"
            infoDescription={kpiInfo.margem_operacional.long}
            infoFormula={kpiInfo.margem_operacional.formula}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cupons">Cupons</TabsTrigger>
            <TabsTrigger value="repasse">Repasse</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <MonthlyRevenueChart />
          </TabsContent>

          <TabsContent value="cupons" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Receita por Tipo de Cupom</h3>
              {receitaPorCupom && receitaPorCupom.dados_cupons.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Cupom</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Total Cupom</TableHead>
                      <TableHead className="text-right">Ticket Médio</TableHead>
                      <TableHead className="text-right">Repasse</TableHead>
                      <TableHead className="text-right">Receita Líquida</TableHead>
                      <TableHead className="text-right">Participação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receitaPorCupom.dados_cupons.map((cupom, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{cupom.tipo_cupom}</TableCell>
                        <TableCell className="text-right">{cupom.quantidade.toLocaleString()}</TableCell>
                        <TableCell className="text-right">R$ {cupom.total_valor_cupom.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">R$ {cupom.ticket_medio.toFixed(2)}</TableCell>
                        <TableCell className="text-right">R$ {cupom.total_repasse.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">R$ {cupom.receita_liquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">{cupom.participacao_percentual.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Carregando dados...</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="repasse" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Participação por Período</h3>
              {participacaoPorPeriodo && participacaoPorPeriodo.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Ticket Médio</TableHead>
                      <TableHead className="text-right">Participação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participacaoPorPeriodo.map((periodo, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{periodo.periodo}</TableCell>
                        <TableCell className="text-right">{periodo.quantidade.toLocaleString()}</TableCell>
                        <TableCell className="text-right">R$ {periodo.total_valor_cupom.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell className="text-right">R$ {periodo.ticket_medio.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{periodo.participacao_percentual.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">Carregando dados...</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Participação por Dia da Semana</h3>
              {participacaoDiaria && participacaoDiaria.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dia da Semana</TableHead>
                      <TableHead className="text-right">Ticket Médio</TableHead>
                      <TableHead className="text-right">Total do Dia</TableHead>
                      <TableHead className="text-right">Participação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...participacaoDiaria]
                      .sort((a, b) => {
                        // dow: 1=Domingo, 2=Segunda, 3=Terça, 4=Quarta, 5=Quinta, 6=Sexta, 7=Sábado
                        // Ordem desejada: Segunda(2), Terça(3), Quarta(4), Quinta(5), Sexta(6), Sábado(7), Domingo(1)
                        const orderMap: { [key: number]: number } = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 1: 6 };
                        return orderMap[a.dow] - orderMap[b.dow];
                      })
                      .map((dia, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{dia.dia_semana}</TableCell>
                          <TableCell className="text-right">R$ {dia.ticket_medio.toFixed(2)}</TableCell>
                          <TableCell className="text-right">R$ {dia.total_por_dia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{dia.participacao_percentual.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
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

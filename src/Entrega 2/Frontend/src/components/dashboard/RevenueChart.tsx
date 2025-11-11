import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { kpisService } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";

export const RevenueChart = () => {
  const { data: participacaoData, isLoading } = useQuery({
    queryKey: ['participacao-periodo'],
    queryFn: kpisService.getParticipacaoPorPeriodo,
  });

  if (isLoading) {
    return (
      <Card className="p-6 shadow-soft">
        <Skeleton className="h-[400px]" />
      </Card>
    );
  }

  const chartData = participacaoData?.map(item => ({
    name: item.periodo,
    receita: item.total_valor_cupom,
    cupons: item.quantidade,
    ticketMedio: item.ticket_medio,
  })) || [];
  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Análise de Receita Temporal</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Comparativo de receitas nos últimos 6 meses
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => `R$ ${value.toLocaleString()}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="receita"
            name="Receita Total"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="cupons"
            name="Quantidade Cupons"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: "hsl(var(--accent))", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

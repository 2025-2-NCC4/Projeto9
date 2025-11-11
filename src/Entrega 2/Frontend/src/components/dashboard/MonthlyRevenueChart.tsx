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

export const MonthlyRevenueChart = () => {
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

  // Processar dados para mostrar por dia do mês
  const chartData = participacaoData?.map(item => ({
    dia: item.periodo,
    receita: item.total_valor_cupom,
    cupons: item.quantidade,
  })) || [];

  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Receita e Cupons por Período</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Análise de receita total e quantidade de cupons
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="dia" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `R$ ${value / 1000}k`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => 
              name === "receita" 
                ? [`R$ ${value.toLocaleString()}`, "Receita Total"]
                : [value.toLocaleString(), "Quantidade Cupons"]
            }
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="receita"
            name="Receita Total"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cupons"
            name="Quantidade Cupons"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--accent))", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

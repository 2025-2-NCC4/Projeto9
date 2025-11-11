import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { kpisService } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export const LocationZoneChart = () => {
  const { data: zonaData, isLoading } = useQuery({
    queryKey: ['usuarios-zona'],
    queryFn: () => kpisService.getUsuariosPorZona({ limit: 10 }),
  });

  if (isLoading) {
    return (
      <Card className="p-6 shadow-soft">
        <Skeleton className="h-[350px]" />
      </Card>
    );
  }

  const chartData = zonaData?.data
    ?.map((item, index) => ({
      zona: item.zona,
      usuarios: item.total_usuarios,
      percentual: item.percentual,
      fill: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => b.usuarios - a.usuarios) || [];

  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Usuários por Zona</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Distribuição de usuários por região (ordenado por quantidade)
        </p>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="zona" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            label={{ value: 'Usuários', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              padding: "12px",
            }}
            labelStyle={{ 
              color: "hsl(var(--foreground))",
              fontWeight: 600,
              marginBottom: "4px"
            }}
            formatter={(value: number, name: string, props: any) => [
              `${value.toLocaleString()} usuários (${props.payload?.percentual?.toFixed(1) || '0.0'}%)`,
              "Total"
            ]}
          />
          <Bar 
            dataKey="usuarios" 
            radius={[8, 8, 0, 0]}
            label={{ position: 'top', fontSize: 11, fill: 'hsl(var(--foreground))' }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Os valores no topo das barras representam a quantidade de usuários
      </div>
    </Card>
  );
};

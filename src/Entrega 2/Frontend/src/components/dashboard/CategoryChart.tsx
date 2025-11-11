import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
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
import { useState } from "react";

export const CategoryChart = () => {
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  
  const { data: segmentosData, isLoading } = useQuery({
    queryKey: ['segmentos'],
    queryFn: () => kpisService.getTotalSegmentos({ limit: 10 }),
  });

  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <button
            key={`legend-${index}`}
            onClick={() => handleLegendClick(entry.dataKey)}
            className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
              hiddenSeries[entry.dataKey]
                ? 'opacity-50 hover:opacity-70'
                : 'opacity-100 hover:opacity-80'
            }`}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ 
                backgroundColor: hiddenSeries[entry.dataKey] 
                  ? 'hsl(var(--muted-foreground))' 
                  : entry.color 
              }}
            />
            <span className={hiddenSeries[entry.dataKey] ? 'text-muted-foreground' : ''}>
              {entry.value}
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-6 shadow-soft">
        <Skeleton className="h-[350px]" />
      </Card>
    );
  }

  const chartData = segmentosData?.seguimentos?.map(item => ({
    categoria: item.categoria_estabelecimento,
    receita: item.total_valor_cupom,
    cupons: item.total_ocorrencias,
  })) || [];
  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Receita por Segmento</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Clique na legenda para mostrar/ocultar séries
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="categoria" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            angle={-15}
            textAnchor="end"
            height={80}
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
            formatter={(value: number, name: string) => 
              name === "receita" 
                ? [`R$ ${value.toLocaleString()}`, "Receita"]
                : [value, "Cupons Utilizados"]
            }
          />
          <Legend content={<CustomLegend />} />
          <Bar 
            dataKey="receita" 
            name="Receita"
            fill="hsl(var(--primary))" 
            fillOpacity={hiddenSeries['receita'] ? 0.2 : 1}
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="cupons" 
            name="Cupons"
            fill="hsl(var(--accent))" 
            fillOpacity={hiddenSeries['cupons'] ? 0.2 : 1}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

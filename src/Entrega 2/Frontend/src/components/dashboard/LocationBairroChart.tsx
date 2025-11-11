import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { kpisService } from "@/services/kpis";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export const LocationBairroChart = () => {
  const [tipo, setTipo] = useState<'bairro_residencial' | 'bairro_trabalho' | 'bairro_escola'>('bairro_residencial');

  const { data: bairroData, isLoading } = useQuery({
    queryKey: ['usuarios-bairro', tipo],
    queryFn: () => kpisService.getUsuariosPorBairro({ tipo, limit: 10 }),
  });

  if (isLoading) {
    return (
      <Card className="p-6 shadow-soft">
        <Skeleton className="h-[450px]" />
      </Card>
    );
  }

  const chartData = bairroData?.data
    ?.sort((a, b) => b.total_usuarios - a.total_usuarios)
    .slice(0, 10)
    .map(item => ({
      bairro: item.bairro,
      usuarios: item.total_usuarios,
      percentual: item.percentual,
    })) || [];

  const tipoLabels = {
    bairro_residencial: 'Residencial',
    bairro_trabalho: 'Trabalho',
    bairro_escola: 'Escola',
  };

  return (
    <Card className="p-6 shadow-soft">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Top 10 Bairros por Usuários</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Clique nas abas para alternar entre residencial, trabalho e escola
        </p>
      </div>
      
      <Tabs value={tipo} onValueChange={(v) => setTipo(v as any)} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-secondary/50">
          <TabsTrigger value="bairro_residencial" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Residencial
          </TabsTrigger>
          <TabsTrigger value="bairro_trabalho" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Trabalho
          </TabsTrigger>
          <TabsTrigger value="bairro_escola" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Escola
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="bairro" 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '11px', fontWeight: 500 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px', fontWeight: 500 }}
            label={{ value: 'Usuários', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: 'hsl(var(--muted-foreground))' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              padding: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ 
              color: "hsl(var(--foreground))",
              fontWeight: 600,
              marginBottom: "4px"
            }}
            formatter={(value: number, name: string, props: any) => [
              `${value.toLocaleString()} usuários (${props.payload?.percentual?.toFixed(1) || '0.0'}%)`,
              tipoLabels[tipo]
            ]}
          />
          <Bar 
            dataKey="usuarios" 
            fill="hsl(var(--primary))"
            radius={[8, 8, 0, 0]}
            label={{ position: 'top', fontSize: 10, fill: 'hsl(var(--foreground))', fontWeight: 600 }}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Mostrando os 10 bairros com maior concentração de usuários
      </div>
    </Card>
  );
};

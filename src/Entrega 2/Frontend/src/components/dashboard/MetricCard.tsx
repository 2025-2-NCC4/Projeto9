import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MetricInfo } from "@/components/ui/MetricInfo";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  infoKey?: string;
  infoDescription?: string;
  infoFormula?: string;
}

export const MetricCard = ({
  title,
  value,
  change,
  changeLabel = "vs. mês anterior",
  icon: Icon,
  trend = "up",
  infoDescription,
  infoFormula,
}: MetricCardProps) => {
  const isPositive = change > 0;
  const trendColor = trend === "up" 
    ? (isPositive ? "text-success" : "text-destructive")
    : (isPositive ? "text-destructive" : "text-success");

  return (
    <Card className="p-6 shadow-soft hover:shadow-card transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {infoDescription && (
              <MetricInfo 
                title={title}
                description={infoDescription}
                formula={infoFormula}
              />
            )}
          </div>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn("text-sm font-semibold", trendColor)}>
          {isPositive ? "+" : ""}{change}%
        </span>
        <span className="text-xs text-muted-foreground">{changeLabel}</span>
      </div>
    </Card>
  );
};

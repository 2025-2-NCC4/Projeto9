import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricInfoProps {
  title: string;
  description: string;
  formula?: string;
}

export const MetricInfo = ({ title, description, formula }: MetricInfoProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center justify-center ml-1 w-4 h-4 rounded-full bg-muted hover:bg-muted/80 transition-colors">
            <Info className="w-3 h-3 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-4" side="top">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            {formula && (
              <p className="text-xs font-mono bg-muted/50 p-2 rounded mt-2">
                {formula}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

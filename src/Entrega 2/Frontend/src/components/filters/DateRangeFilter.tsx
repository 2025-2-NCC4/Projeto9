import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  onDateChange: (start: string | undefined, end: string | undefined) => void;
}

export const DateRangeFilter = ({ onDateChange }: DateRangeFilterProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onDateChange(
      date ? format(date, 'yyyy-MM-dd') : undefined,
      endDate ? format(endDate, 'yyyy-MM-dd') : undefined
    );
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onDateChange(
      startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      date ? format(date, 'yyyy-MM-dd') : undefined
    );
  };

  return (
    <div className="flex gap-3 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Data inicial"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">até</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Data final"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

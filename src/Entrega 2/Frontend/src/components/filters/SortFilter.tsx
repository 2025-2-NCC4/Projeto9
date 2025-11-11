import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

interface SortFilterProps {
  options: { value: string; label: string }[];
  onSortChange: (sort: string, order: 'asc' | 'desc') => void;
}

export const SortFilter = ({ options, onSortChange }: SortFilterProps) => {
  return (
    <div className="flex gap-3 items-center">
      <Select onValueChange={(value) => {
        const [sort, order] = value.split('-');
        onSortChange(sort, order as 'asc' | 'desc');
      }}>
        <SelectTrigger className="w-[200px]">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

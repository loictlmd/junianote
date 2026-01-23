import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GradeInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  className?: string;
}

const GradeInput = ({ value, onChange, className }: GradeInputProps) => {
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val === "") {
      onChange(undefined);
      return;
    }
    
    const numVal = parseFloat(val.replace(",", "."));
    if (!isNaN(numVal) && numVal >= 0 && numVal <= 20) {
      onChange(numVal);
    }
  };

  const getGradeColor = () => {
    if (value === undefined) return "";
    if (value >= 16) return "border-success focus:ring-success/30";
    if (value >= 12) return "border-primary focus:ring-primary/30";
    if (value >= 10) return "border-warning focus:ring-warning/30";
    return "border-destructive focus:ring-destructive/30";
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={inputValue}
      onChange={handleChange}
      placeholder="--"
      className={cn(
        "w-16 text-center font-semibold transition-all duration-200",
        "focus:ring-2 focus:ring-offset-1",
        getGradeColor(),
        className
      )}
      maxLength={5}
    />
  );
};

export default GradeInput;

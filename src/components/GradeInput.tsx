import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface GradeInputProps {
  value?: number;
  onChange: (value: number | undefined) => void;
  max?: number;
  className?: string;
}

const GradeInput = ({ value, onChange, max = 20, className }: GradeInputProps) => {
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val === "") {
      onChange(undefined);
      return;
    }
    
    const numVal = parseFloat(val.replace(",", "."));
    if (!isNaN(numVal) && numVal >= 0 && numVal <= max) {
      onChange(numVal);
    }
  };

  const getGradeColor = () => {
    if (value === undefined) return "";
    const percentage = (value / max) * 100;
    if (percentage >= 80) return "border-success focus:ring-success/30";
    if (percentage >= 60) return "border-primary focus:ring-primary/30";
    if (percentage >= 50) return "border-warning focus:ring-warning/30";
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

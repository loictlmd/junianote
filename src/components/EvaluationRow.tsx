import { Evaluation } from "@/data/curriculum";
import GradeInput from "./GradeInput";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EvaluationRowProps {
  evaluation: Evaluation;
  onGradeChange: (grade: number | undefined) => void;
  colorClass?: string;
}

const EvaluationRow = ({ evaluation, onGradeChange, colorClass }: EvaluationRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2 px-3 rounded-md transition-all duration-200",
        "hover:bg-muted/30 group"
      )}
    >
      <div className="flex items-center gap-2 flex-1">
        <div className={cn(
          "w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125",
          colorClass || "bg-primary"
        )} />
        <span className="text-sm text-foreground">{evaluation.name}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="font-mono text-xs">
          {evaluation.maxPoints} pts
        </Badge>
        <GradeInput
          value={evaluation.grade}
          onChange={onGradeChange}
          max={evaluation.maxPoints}
        />
        <span className="text-muted-foreground text-xs w-12">/{evaluation.maxPoints}</span>
      </div>
    </div>
  );
};

export default EvaluationRow;

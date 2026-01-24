import { Subject, calculateSubjectAverage, getColorClass } from "@/data/curriculum";
import EvaluationRow from "./EvaluationRow";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SubjectCardProps {
  subject: Subject;
  onEvaluationGradeChange: (evaluationId: string, grade: number | undefined) => void;
  colorClass?: string;
  color: string;
}

const SubjectCard = ({ subject, onEvaluationGradeChange, colorClass, color }: SubjectCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const average = calculateSubjectAverage(subject);
  const gradedCount = subject.evaluations.filter(e => e.grade !== undefined).length;
  const progress = gradedCount / subject.evaluations.length;

  const getAverageColor = (avg: number | null) => {
    if (avg === null) return "text-muted-foreground";
    if (avg >= 16) return "text-success";
    if (avg >= 12) return "text-primary";
    if (avg >= 10) return "text-warning";
    return "text-destructive";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={cn(
        "rounded-lg border transition-all duration-200",
        "bg-card/50 hover:bg-card",
        isOpen && "shadow-sm"
      )}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <ChevronDown className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                isOpen && "rotate-180"
              )} />
              <span className="font-medium text-foreground text-left">{subject.name}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-xs">
                {subject.totalPoints} pts total
              </Badge>
              <div className={cn(
                "text-lg font-bold font-display",
                getAverageColor(average)
              )}>
                {average !== null ? average.toFixed(1) : "--"}
                <span className="text-xs text-muted-foreground">/20</span>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="px-4 pb-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", getColorClass(color))}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-1 border-t border-border/50 pt-2">
            {subject.evaluations.map((evaluation) => (
              <EvaluationRow
                key={evaluation.id}
                evaluation={evaluation}
                onGradeChange={(grade) => onEvaluationGradeChange(evaluation.id, grade)}
                colorClass={colorClass}
              />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default SubjectCard;

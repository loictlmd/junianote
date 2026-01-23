import { Subject } from "@/data/curriculum";
import GradeInput from "./GradeInput";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SubjectRowProps {
  subject: Subject;
  onGradeChange: (grade: number | undefined) => void;
  colorClass?: string;
}

const SubjectRow = ({ subject, onGradeChange, colorClass }: SubjectRowProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg transition-all duration-200",
        "hover:bg-muted/50 group",
        "animate-fade-in"
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className={cn(
          "w-2 h-2 rounded-full transition-transform group-hover:scale-125",
          colorClass || "bg-primary"
        )} />
        <span className="font-medium text-foreground">{subject.name}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="font-mono text-xs">
          Coef. {subject.coefficient}
        </Badge>
        <GradeInput
          value={subject.grade}
          onChange={onGradeChange}
        />
        <span className="text-muted-foreground text-sm w-8">/20</span>
      </div>
    </div>
  );
};

export default SubjectRow;

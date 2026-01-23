import { UE, getColorClass, getColorBorderClass, getColorBgClass } from "@/data/curriculum";
import SubjectRow from "./SubjectRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, TrendingUp } from "lucide-react";

interface UECardProps {
  ue: UE;
  onSubjectGradeChange: (subjectId: string, grade: number | undefined) => void;
}

const UECard = ({ ue, onSubjectGradeChange }: UECardProps) => {
  const calculateAverage = (): number | null => {
    const gradedSubjects = ue.subjects.filter(s => s.grade !== undefined);
    if (gradedSubjects.length === 0) return null;
    
    const totalWeighted = gradedSubjects.reduce(
      (sum, s) => sum + (s.grade! * s.coefficient),
      0
    );
    const totalCoef = gradedSubjects.reduce((sum, s) => sum + s.coefficient, 0);
    
    return totalWeighted / totalCoef;
  };

  const average = calculateAverage();
  const progress = ue.subjects.filter(s => s.grade !== undefined).length / ue.subjects.length;

  const getAverageColor = (avg: number | null) => {
    if (avg === null) return "text-muted-foreground";
    if (avg >= 16) return "text-success";
    if (avg >= 12) return "text-primary";
    if (avg >= 10) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        "hover:shadow-elevated hover:-translate-y-1",
        "border-2",
        getColorBorderClass(ue.color),
        "animate-slide-up"
      )}
    >
      <CardHeader className={cn("pb-3", getColorBgClass(ue.color))}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className={cn(getColorClass(ue.color), "font-mono text-xs")}>
                {ue.code}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {ue.credits} ECTS
              </Badge>
            </div>
            <CardTitle className="text-xl font-display">{ue.name}</CardTitle>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Moyenne</span>
            </div>
            <div className={cn(
              "text-3xl font-bold font-display transition-colors",
              getAverageColor(average)
            )}>
              {average !== null ? average.toFixed(2) : "--"}
              <span className="text-lg text-muted-foreground">/20</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {ue.subjects.filter(s => s.grade !== undefined).length}/{ue.subjects.length} notes
            </span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                getColorClass(ue.color)
              )}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 pb-4 space-y-1">
        {ue.subjects.map((subject) => (
          <SubjectRow
            key={subject.id}
            subject={subject}
            onGradeChange={(grade) => onSubjectGradeChange(subject.id, grade)}
            colorClass={getColorClass(ue.color)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default UECard;

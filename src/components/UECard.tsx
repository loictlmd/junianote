import { UE, getColorClass, getColorBorderClass, getColorBgClass, calculateUEAverage } from "@/data/curriculum";
import SubjectCard from "./SubjectCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BookOpen, TrendingUp } from "lucide-react";

interface UECardProps {
  ue: UE;
  onEvaluationGradeChange: (subjectId: string, evaluationId: string, grade: number | undefined) => void;
}

const UECard = ({ ue, onEvaluationGradeChange }: UECardProps) => {
  const average = calculateUEAverage(ue);
  
  const getTotalEvaluations = () => {
    return ue.subjects.reduce((sum, s) => sum + s.evaluations.length, 0);
  };
  
  const getGradedEvaluations = () => {
    return ue.subjects.reduce(
      (sum, s) => sum + s.evaluations.filter(e => e.grade !== undefined).length, 
      0
    );
  };
  
  const progress = getTotalEvaluations() > 0 ? getGradedEvaluations() / getTotalEvaluations() : 0;

  const getAverageColor = (avg: number | null) => {
    if (avg === null) return "text-muted-foreground";
    if (avg >= 16) return "text-success";
    if (avg >= 12) return "text-primary";
    if (avg >= 10) return "text-warning";
    return "text-destructive";
  };

  const getTotalPoints = () => {
    return ue.subjects.reduce((sum, s) => sum + s.totalPoints, 0);
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
              {getGradedEvaluations()}/{getTotalEvaluations()} notes
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
      
      <CardContent className="pt-4 pb-4 space-y-3">
        {ue.subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            color={ue.color}
            onEvaluationGradeChange={(evaluationId, grade) => 
              onEvaluationGradeChange(subject.id, evaluationId, grade)
            }
            colorClass={getColorClass(ue.color)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default UECard;

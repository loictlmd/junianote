import { Semester, UE } from "@/data/curriculum";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GraduationCap, Award, Target, Sparkles } from "lucide-react";

interface SemesterOverviewProps {
  semester: Semester;
  ues: UE[];
}

const SemesterOverview = ({ semester, ues }: SemesterOverviewProps) => {
  const calculateGlobalAverage = (): number | null => {
    let totalWeighted = 0;
    let totalCredits = 0;
    
    ues.forEach(ue => {
      const gradedSubjects = ue.subjects.filter(s => s.grade !== undefined);
      if (gradedSubjects.length === 0) return;
      
      const ueTotal = gradedSubjects.reduce(
        (sum, s) => sum + (s.grade! * s.coefficient),
        0
      );
      const ueCoef = gradedSubjects.reduce((sum, s) => sum + s.coefficient, 0);
      const ueAverage = ueTotal / ueCoef;
      
      totalWeighted += ueAverage * ue.credits;
      totalCredits += ue.credits;
    });
    
    return totalCredits > 0 ? totalWeighted / totalCredits : null;
  };

  const getValidatedCredits = (): number => {
    return ues.reduce((sum, ue) => {
      const gradedSubjects = ue.subjects.filter(s => s.grade !== undefined);
      if (gradedSubjects.length === 0) return sum;
      
      const ueTotal = gradedSubjects.reduce(
        (sum, s) => sum + (s.grade! * s.coefficient),
        0
      );
      const ueCoef = gradedSubjects.reduce((sum, s) => sum + s.coefficient, 0);
      const ueAverage = ueTotal / ueCoef;
      
      return ueAverage >= 10 ? sum + ue.credits : sum;
    }, 0);
  };

  const getTotalCredits = (): number => {
    return ues.reduce((sum, ue) => sum + ue.credits, 0);
  };

  const globalAverage = calculateGlobalAverage();
  const validatedCredits = getValidatedCredits();
  const totalCredits = getTotalCredits();

  const getAverageStatus = (avg: number | null) => {
    if (avg === null) return { text: "En attente", color: "text-muted-foreground", bg: "bg-muted" };
    if (avg >= 16) return { text: "Excellent", color: "text-success", bg: "bg-success/10" };
    if (avg >= 14) return { text: "Très bien", color: "text-primary", bg: "bg-primary/10" };
    if (avg >= 12) return { text: "Bien", color: "text-primary", bg: "bg-primary/10" };
    if (avg >= 10) return { text: "Validé", color: "text-warning", bg: "bg-warning/10" };
    return { text: "Non validé", color: "text-destructive", bg: "bg-destructive/10" };
  };

  const status = getAverageStatus(globalAverage);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-muted/30 animate-scale-in">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Global Average */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center",
              "shadow-soft",
              globalAverage !== null && globalAverage >= 10 
                ? "bg-gradient-to-br from-primary to-secondary" 
                : "bg-muted"
            )}>
              <GraduationCap className={cn(
                "w-10 h-10",
                globalAverage !== null && globalAverage >= 10 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground"
              )} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Moyenne Générale</p>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-4xl font-bold font-display transition-colors",
                  status.color
                )}>
                  {globalAverage !== null ? globalAverage.toFixed(2) : "--"}
                </span>
                <span className="text-lg text-muted-foreground">/20</span>
              </div>
              <div className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                status.bg, status.color
              )}>
                <Sparkles className="w-3 h-3" />
                {status.text}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Target className="w-4 h-4" />
                <span className="text-xs">UE Validées</span>
              </div>
              <div className="text-2xl font-bold font-display text-foreground">
                {ues.filter(ue => {
                  const gradedSubjects = ue.subjects.filter(s => s.grade !== undefined);
                  if (gradedSubjects.length === 0) return false;
                  const total = gradedSubjects.reduce((sum, s) => sum + (s.grade! * s.coefficient), 0);
                  const coef = gradedSubjects.reduce((sum, s) => sum + s.coefficient, 0);
                  return (total / coef) >= 10;
                }).length}
                <span className="text-muted-foreground text-lg">/{ues.length}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs">Crédits ECTS</span>
              </div>
              <div className="text-2xl font-bold font-display text-foreground">
                {validatedCredits}
                <span className="text-muted-foreground text-lg">/{totalCredits}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SemesterOverview;

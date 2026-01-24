import { useState, useCallback, useEffect } from "react";
import { 
  classes, 
  getSemesterById, 
  UE, 
  Semester,
  StudentProfile 
} from "@/data/curriculum";
import { useProfile } from "@/contexts/ProfileContext";
import Header from "@/components/Header";
import SemesterOverview from "@/components/SemesterOverview";
import UECard from "@/components/UECard";
import { useNavigate } from "react-router-dom";

const GRADES_STORAGE_KEY = "moyennecalc_grades";

const Index = () => {
  const { profile, isLoading } = useProfile();
  const navigate = useNavigate();
  const [ueData, setUeData] = useState<UE[]>([]);

  // Redirect if no profile
  useEffect(() => {
    if (!isLoading && !profile) {
      navigate("/setup");
    }
  }, [isLoading, profile, navigate]);

  // Load semester data with saved grades
  useEffect(() => {
    if (!profile) return;
    
    const semester = getSemesterById(profile.classId, profile.semesterId);
    if (!semester) return;

    // Deep clone the semester UEs
    const clonedUEs: UE[] = JSON.parse(JSON.stringify(semester.ues));
    
    // Load saved grades from localStorage
    const savedGrades = localStorage.getItem(`${GRADES_STORAGE_KEY}_${profile.classId}_${profile.semesterId}`);
    if (savedGrades) {
      try {
        const grades: Record<string, number> = JSON.parse(savedGrades);
        clonedUEs.forEach(ue => {
          ue.subjects.forEach(subject => {
            subject.evaluations.forEach(evaluation => {
              if (grades[evaluation.id] !== undefined) {
                evaluation.grade = grades[evaluation.id];
              }
            });
          });
        });
      } catch (e) {
        console.error("Error loading saved grades:", e);
      }
    }
    
    setUeData(clonedUEs);
  }, [profile]);

  // Save grades to localStorage whenever they change
  const saveGrades = useCallback((ues: UE[]) => {
    if (!profile) return;
    
    const grades: Record<string, number> = {};
    ues.forEach(ue => {
      ue.subjects.forEach(subject => {
        subject.evaluations.forEach(evaluation => {
          if (evaluation.grade !== undefined) {
            grades[evaluation.id] = evaluation.grade;
          }
        });
      });
    });
    
    localStorage.setItem(`${GRADES_STORAGE_KEY}_${profile.classId}_${profile.semesterId}`, JSON.stringify(grades));
  }, [profile]);

  const handleEvaluationGradeChange = useCallback(
    (ueId: string, subjectId: string, evaluationId: string, grade: number | undefined) => {
      setUeData((prev) => {
        const updated = prev.map((ue) => {
          if (ue.id !== ueId) return ue;
          return {
            ...ue,
            subjects: ue.subjects.map((subject) => {
              if (subject.id !== subjectId) return subject;
              return {
                ...subject,
                evaluations: subject.evaluations.map((evaluation) => {
                  if (evaluation.id !== evaluationId) return evaluation;
                  return { ...evaluation, grade };
                }),
              };
            }),
          };
        });
        saveGrades(updated);
        return updated;
      });
    },
    [saveGrades]
  );

  const handleReset = useCallback(() => {
    if (!profile) return;
    
    const semester = getSemesterById(profile.classId, profile.semesterId);
    if (!semester) return;
    
    const clonedUEs: UE[] = JSON.parse(JSON.stringify(semester.ues));
    setUeData(clonedUEs);
    localStorage.removeItem(`${GRADES_STORAGE_KEY}_${profile.classId}_${profile.semesterId}`);
  }, [profile]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  const classData = classes.find(c => c.id === profile.classId);
  const semesterData = getSemesterById(profile.classId, profile.semesterId);

  return (
    <div className="min-h-screen bg-background">
      <Header onReset={handleReset} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {classData?.name} - {semesterData?.name}
          </h2>
          <p className="text-muted-foreground">
            Bonjour {profile.firstName} ! Saisis tes notes pour calculer tes moyennes.
          </p>
        </div>

        <div className="space-y-6">
          <SemesterOverview ues={ueData} />
          
          <div className="grid gap-6 lg:grid-cols-2">
            {ueData.map((ue, index) => (
              <div
                key={ue.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <UECard
                  ue={ue}
                  onEvaluationGradeChange={(subjectId, evaluationId, grade) =>
                    handleEvaluationGradeChange(ue.id, subjectId, evaluationId, grade)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>MoyenneCalc - Calculateur de moyennes pour étudiants</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

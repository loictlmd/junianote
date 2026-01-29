import { useEffect } from "react";
import { useUserProfile } from "@/hooks/useProfile";
import { useGrades } from "@/hooks/useGrades";
import { useCurriculumData } from "@/hooks/useCurriculumData";
import Header from "@/components/Header";
import SemesterOverview from "@/components/SemesterOverview";
import UECard from "@/components/UECard";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { classes, semesters, isLoading: curriculumDataLoading } = useCurriculumData();
  const navigate = useNavigate();
  
  const {
    ueData,
    isLoading: gradesLoading,
    isSaving,
    hasUnsavedChanges,
    curriculumError,
    handleEvaluationGradeChange,
    saveGrades,
    resetGrades,
  } = useGrades(profile?.class_id, profile?.semester_id);

  // Redirect if no profile
  useEffect(() => {
    if (!profileLoading && !profile) {
      navigate("/setup");
    }
  }, [profileLoading, profile, navigate]);

  if (profileLoading || gradesLoading || curriculumDataLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  const classData = classes.find(c => c.id === profile.class_id);
  const semesterData = semesters.find(s => s.id === profile.semester_id);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onReset={resetGrades} 
        onSave={saveGrades}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">
            {classData?.name || "Classe"} - {semesterData?.name || "Semestre"}
          </h2>
          <p className="text-muted-foreground">
            Bonjour {profile.first_name} ! Saisis tes notes pour calculer tes moyennes.
          </p>
        </div>

        {curriculumError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>
              {curriculumError}. Veuillez vérifier vos paramètres de classe et semestre dans les réglages.
            </AlertDescription>
          </Alert>
        ) : ueData.length === 0 ? (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Aucune donnée</AlertTitle>
            <AlertDescription>
              Aucune UE n'a été trouvée pour ce semestre. Veuillez contacter l'administrateur ou vérifier vos paramètres.
            </AlertDescription>
          </Alert>
        ) : (
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
        )}
      </main>
      
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>JUNIA Note - Calculateur de moyennes pour étudiants JUNIA</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

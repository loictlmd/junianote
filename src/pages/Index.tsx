import { useEffect } from "react";
import { classes, getSemesterById } from "@/data/curriculum";
import { useUserProfile } from "@/hooks/useProfile";
import { useGrades } from "@/hooks/useGrades";
import Header from "@/components/Header";
import SemesterOverview from "@/components/SemesterOverview";
import UECard from "@/components/UECard";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  
  const {
    ueData,
    isLoading: gradesLoading,
    isSaving,
    hasUnsavedChanges,
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

  if (profileLoading || gradesLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  const classData = classes.find(c => c.id === profile.class_id);
  const semesterData = getSemesterById(profile.class_id, profile.semester_id);

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
            {classData?.name} - {semesterData?.name}
          </h2>
          <p className="text-muted-foreground">
            Bonjour {profile.first_name} ! Saisis tes notes pour calculer tes moyennes.
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
          <p>MoyenneCalc - Calculateur de moyennes pour étudiants JUNIA</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

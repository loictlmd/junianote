import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UE, getSemesterById } from "@/data/curriculum";
import { toast } from "sonner";

export const useGrades = (classId: string | undefined, semesterId: string | undefined) => {
  const { user } = useAuth();
  const [ueData, setUeData] = useState<UE[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingGradesRef = useRef<UE[]>([]);

  // Load semester data with saved grades from database
  useEffect(() => {
    const loadGrades = async () => {
      if (!classId || !semesterId) {
        setIsLoading(false);
        return;
      }

      const semester = getSemesterById(classId, semesterId);
      if (!semester) {
        setIsLoading(false);
        return;
      }

      // Deep clone the semester UEs
      const clonedUEs: UE[] = JSON.parse(JSON.stringify(semester.ues));

      if (user) {
        // Load grades from database
        const { data: grades, error } = await supabase
          .from("grades")
          .select("evaluation_id, grade")
          .eq("user_id", user.id);

        if (!error && grades) {
          const gradesMap: Record<string, number> = {};
          grades.forEach((g) => {
            gradesMap[g.evaluation_id] = Number(g.grade);
          });

          clonedUEs.forEach((ue) => {
            ue.subjects.forEach((subject) => {
              subject.evaluations.forEach((evaluation) => {
                if (gradesMap[evaluation.id] !== undefined) {
                  evaluation.grade = gradesMap[evaluation.id];
                }
              });
            });
          });
        }
      }

      setUeData(clonedUEs);
      pendingGradesRef.current = clonedUEs;
      setIsLoading(false);
      setHasUnsavedChanges(false);
    };

    loadGrades();
  }, [classId, semesterId, user]);

  // Auto-save function
  const performAutoSave = useCallback(async (dataToSave: UE[]) => {
    if (!user) return;

    setIsSaving(true);

    try {
      // Collect all grades
      const gradesToSave: { user_id: string; evaluation_id: string; grade: number }[] = [];
      
      dataToSave.forEach((ue) => {
        ue.subjects.forEach((subject) => {
          subject.evaluations.forEach((evaluation) => {
            if (evaluation.grade !== undefined) {
              gradesToSave.push({
                user_id: user.id,
                evaluation_id: evaluation.id,
                grade: evaluation.grade,
              });
            }
          });
        });
      });

      // Delete existing grades for this user
      await supabase.from("grades").delete().eq("user_id", user.id);

      // Insert new grades
      if (gradesToSave.length > 0) {
        const { error } = await supabase.from("grades").insert(gradesToSave);
        if (error) throw error;
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error auto-saving grades:", error);
      toast.error("Erreur lors de la sauvegarde automatique");
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  // Debounced auto-save effect
  useEffect(() => {
    if (hasUnsavedChanges && user) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set a new timeout to save after 1 second of inactivity
      saveTimeoutRef.current = setTimeout(() => {
        performAutoSave(pendingGradesRef.current);
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, user, performAutoSave]);

  // Save on unmount or page change
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges && user) {
        // Perform synchronous save attempt
        performAutoSave(pendingGradesRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save any pending changes when component unmounts
      if (hasUnsavedChanges && user && pendingGradesRef.current.length > 0) {
        performAutoSave(pendingGradesRef.current);
      }
    };
  }, [hasUnsavedChanges, user, performAutoSave]);

  const handleEvaluationGradeChange = useCallback(
    (ueId: string, subjectId: string, evaluationId: string, grade: number | undefined) => {
      setUeData((prev) => {
        const newData = prev.map((ue) => {
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
        pendingGradesRef.current = newData;
        return newData;
      });
      setHasUnsavedChanges(true);
    },
    []
  );

  const saveGrades = useCallback(async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder");
      return;
    }

    // Clear any pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);

    try {
      // Collect all grades
      const gradesToSave: { user_id: string; evaluation_id: string; grade: number }[] = [];
      
      ueData.forEach((ue) => {
        ue.subjects.forEach((subject) => {
          subject.evaluations.forEach((evaluation) => {
            if (evaluation.grade !== undefined) {
              gradesToSave.push({
                user_id: user.id,
                evaluation_id: evaluation.id,
                grade: evaluation.grade,
              });
            }
          });
        });
      });

      // Delete existing grades for this user
      await supabase.from("grades").delete().eq("user_id", user.id);

      // Insert new grades
      if (gradesToSave.length > 0) {
        const { error } = await supabase.from("grades").insert(gradesToSave);
        if (error) throw error;
      }

      toast.success("Notes sauvegardées !");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving grades:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  }, [user, ueData]);

  const resetGrades = useCallback(async () => {
    if (!classId || !semesterId) return;

    const semester = getSemesterById(classId, semesterId);
    if (!semester) return;

    const clonedUEs: UE[] = JSON.parse(JSON.stringify(semester.ues));
    setUeData(clonedUEs);
    pendingGradesRef.current = clonedUEs;
    setHasUnsavedChanges(true);
  }, [classId, semesterId]);

  return {
    ueData,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    handleEvaluationGradeChange,
    saveGrades,
    resetGrades,
  };
};

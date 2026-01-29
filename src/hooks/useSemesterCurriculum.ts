import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UE, Subject, Evaluation, getSemesterById } from "@/data/curriculum";

export const useSemesterCurriculum = (classId: string | undefined, semesterId: string | undefined) => {
  const [ues, setUes] = useState<UE[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurriculum = useCallback(async () => {
    if (!classId || !semesterId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // First, try to load from database (for UUID-based IDs)
    const isUUID = semesterId.length === 36 && semesterId.includes("-");
    
    if (isUUID) {
      try {
        // Fetch UEs for this semester
        const { data: uesData, error: uesError } = await supabase
          .from("curriculum_ues")
          .select("*")
          .eq("semester_id", semesterId)
          .order("display_order");

        if (uesError) throw uesError;
        if (!uesData || uesData.length === 0) {
          setError("Aucune UE trouvée pour ce semestre");
          setIsLoading(false);
          return;
        }

        // Fetch all subjects for these UEs
        const ueIds = uesData.map(ue => ue.id);
        const { data: subjectsData, error: subjectsError } = await supabase
          .from("curriculum_subjects")
          .select("*")
          .in("ue_id", ueIds)
          .order("display_order");

        if (subjectsError) throw subjectsError;

        // Fetch all evaluations for these subjects
        const subjectIds = (subjectsData || []).map(s => s.id);
        const { data: evaluationsData, error: evaluationsError } = await supabase
          .from("curriculum_evaluations")
          .select("*")
          .in("subject_id", subjectIds)
          .order("display_order");

        if (evaluationsError) throw evaluationsError;

        // Build the UE structure
        const formattedUEs: UE[] = uesData.map(ue => {
          const ueSubjects = (subjectsData || []).filter(s => s.ue_id === ue.id);
          
          const subjects: Subject[] = ueSubjects.map(subject => {
            const subjectEvaluations = (evaluationsData || []).filter(e => e.subject_id === subject.id);
            
            const evaluations: Evaluation[] = subjectEvaluations.map(evaluation => ({
              id: evaluation.id,
              name: evaluation.name,
              coefficient: Number(evaluation.coefficient),
              maxPoints: Number(evaluation.max_points),
              grade: undefined,
            }));

            return {
              id: subject.id,
              name: subject.name,
              totalPoints: Number(subject.total_points),
              evaluations,
            };
          });

          return {
            id: ue.id,
            name: ue.name,
            code: ue.code,
            color: ue.color,
            subjects,
          };
        });

        setUes(formattedUEs);
      } catch (err) {
        console.error("Error fetching curriculum from database:", err);
        setError("Erreur lors du chargement du curriculum");
      }
    } else {
      // Fallback to static data for old string-based IDs
      const semester = getSemesterById(classId, semesterId);
      if (semester) {
        // Deep clone to avoid mutations
        const clonedUEs: UE[] = JSON.parse(JSON.stringify(semester.ues));
        setUes(clonedUEs);
      } else {
        setError("Semestre non trouvé dans les données statiques");
      }
    }

    setIsLoading(false);
  }, [classId, semesterId]);

  useEffect(() => {
    fetchCurriculum();
  }, [fetchCurriculum]);

  return {
    ues,
    isLoading,
    error,
    refetch: fetchCurriculum,
  };
};

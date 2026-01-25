import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CurriculumClass {
  id: string;
  code: string;
  name: string;
  full_name: string;
}

export interface CurriculumSemester {
  id: string;
  class_id: string;
  code: string;
  name: string;
}

export interface CurriculumUE {
  id: string;
  semester_id: string;
  code: string;
  name: string;
  color: string;
  display_order: number;
}

export interface CurriculumSubject {
  id: string;
  ue_id: string;
  name: string;
  total_points: number;
  display_order: number;
}

export interface CurriculumEvaluation {
  id: string;
  subject_id: string;
  name: string;
  coefficient: number;
  max_points: number;
  display_order: number;
}

export const useCurriculumAdmin = () => {
  const [classes, setClasses] = useState<CurriculumClass[]>([]);
  const [semesters, setSemesters] = useState<CurriculumSemester[]>([]);
  const [ues, setUes] = useState<CurriculumUE[]>([]);
  const [subjects, setSubjects] = useState<CurriculumSubject[]>([]);
  const [evaluations, setEvaluations] = useState<CurriculumEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [classesRes, semestersRes, uesRes, subjectsRes, evaluationsRes] = await Promise.all([
        supabase.from("curriculum_classes").select("*").order("code"),
        supabase.from("curriculum_semesters").select("*").order("code"),
        supabase.from("curriculum_ues").select("*").order("display_order"),
        supabase.from("curriculum_subjects").select("*").order("display_order"),
        supabase.from("curriculum_evaluations").select("*").order("display_order"),
      ]);

      if (classesRes.data) setClasses(classesRes.data);
      if (semestersRes.data) setSemesters(semestersRes.data);
      if (uesRes.data) setUes(uesRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (evaluationsRes.data) setEvaluations(evaluationsRes.data);
    } catch (error) {
      console.error("Error fetching curriculum:", error);
      toast.error("Erreur lors du chargement des données");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Class CRUD
  const addClass = async (data: Omit<CurriculumClass, "id">) => {
    const { error } = await supabase.from("curriculum_classes").insert(data);
    if (error) {
      toast.error("Erreur lors de l'ajout de la classe");
      return { error };
    }
    toast.success("Classe ajoutée");
    await fetchAll();
    return { error: null };
  };

  const updateClass = async (id: string, data: Partial<CurriculumClass>) => {
    const { error } = await supabase.from("curriculum_classes").update(data).eq("id", id);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
      return { error };
    }
    toast.success("Classe mise à jour");
    await fetchAll();
    return { error: null };
  };

  const deleteClass = async (id: string) => {
    const { error } = await supabase.from("curriculum_classes").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return { error };
    }
    toast.success("Classe supprimée");
    await fetchAll();
    return { error: null };
  };

  // Semester CRUD
  const addSemester = async (data: Omit<CurriculumSemester, "id">) => {
    const { error } = await supabase.from("curriculum_semesters").insert(data);
    if (error) {
      toast.error("Erreur lors de l'ajout du semestre");
      return { error };
    }
    toast.success("Semestre ajouté");
    await fetchAll();
    return { error: null };
  };

  const deleteSemester = async (id: string) => {
    const { error } = await supabase.from("curriculum_semesters").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return { error };
    }
    toast.success("Semestre supprimé");
    await fetchAll();
    return { error: null };
  };

  // UE CRUD
  const addUE = async (data: Omit<CurriculumUE, "id">) => {
    const { error } = await supabase.from("curriculum_ues").insert(data);
    if (error) {
      toast.error("Erreur lors de l'ajout de l'UE");
      return { error };
    }
    toast.success("UE ajoutée");
    await fetchAll();
    return { error: null };
  };

  const deleteUE = async (id: string) => {
    const { error } = await supabase.from("curriculum_ues").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return { error };
    }
    toast.success("UE supprimée");
    await fetchAll();
    return { error: null };
  };

  // Subject CRUD
  const addSubject = async (data: Omit<CurriculumSubject, "id">) => {
    const { error } = await supabase.from("curriculum_subjects").insert(data);
    if (error) {
      toast.error("Erreur lors de l'ajout de la matière");
      return { error };
    }
    toast.success("Matière ajoutée");
    await fetchAll();
    return { error: null };
  };

  const deleteSubject = async (id: string) => {
    const { error } = await supabase.from("curriculum_subjects").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return { error };
    }
    toast.success("Matière supprimée");
    await fetchAll();
    return { error: null };
  };

  // Evaluation CRUD
  const addEvaluation = async (data: Omit<CurriculumEvaluation, "id">) => {
    const { error } = await supabase.from("curriculum_evaluations").insert(data);
    if (error) {
      toast.error("Erreur lors de l'ajout de l'évaluation");
      return { error };
    }
    toast.success("Évaluation ajoutée");
    await fetchAll();
    return { error: null };
  };

  const deleteEvaluation = async (id: string) => {
    const { error } = await supabase.from("curriculum_evaluations").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return { error };
    }
    toast.success("Évaluation supprimée");
    await fetchAll();
    return { error: null };
  };

  return {
    classes,
    semesters,
    ues,
    subjects,
    evaluations,
    isLoading,
    fetchAll,
    addClass,
    updateClass,
    deleteClass,
    addSemester,
    deleteSemester,
    addUE,
    deleteUE,
    addSubject,
    deleteSubject,
    addEvaluation,
    deleteEvaluation,
  };
};

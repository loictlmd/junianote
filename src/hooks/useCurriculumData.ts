import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DBClass {
  id: string;
  code: string;
  name: string;
  full_name: string;
}

export interface DBSemester {
  id: string;
  class_id: string;
  code: string;
  name: string;
}

export interface DBUE {
  id: string;
  semester_id: string;
  code: string;
  name: string;
  color: string;
  display_order: number;
}

export interface DBSubject {
  id: string;
  ue_id: string;
  name: string;
  total_points: number;
  display_order: number;
}

export interface DBEvaluation {
  id: string;
  subject_id: string;
  name: string;
  coefficient: number;
  max_points: number;
  display_order: number;
}

export const useCurriculumData = () => {
  const [classes, setClasses] = useState<DBClass[]>([]);
  const [semesters, setSemesters] = useState<DBSemester[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [classesRes, semestersRes] = await Promise.all([
        supabase.from("curriculum_classes").select("*").order("code"),
        supabase.from("curriculum_semesters").select("*").order("code"),
      ]);

      if (classesRes.data) setClasses(classesRes.data);
      if (semestersRes.data) setSemesters(semestersRes.data);
    } catch (error) {
      console.error("Error fetching curriculum data:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get semesters for a specific class
  const getSemestersForClass = (classId: string) => {
    return semesters.filter(s => s.class_id === classId);
  };

  return {
    classes,
    semesters,
    isLoading,
    getSemestersForClass,
    refetch: fetchData,
  };
};

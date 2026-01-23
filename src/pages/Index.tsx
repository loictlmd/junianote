import { useState, useCallback } from "react";
import { semesters, UE, Semester } from "@/data/curriculum";
import Header from "@/components/Header";
import SemesterOverview from "@/components/SemesterOverview";
import UECard from "@/components/UECard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [semesterData, setSemesterData] = useState<Semester[]>(
    JSON.parse(JSON.stringify(semesters))
  );

  const handleGradeChange = useCallback(
    (semesterId: string, ueId: string, subjectId: string, grade: number | undefined) => {
      setSemesterData((prev) =>
        prev.map((semester) => {
          if (semester.id !== semesterId) return semester;
          return {
            ...semester,
            ues: semester.ues.map((ue) => {
              if (ue.id !== ueId) return ue;
              return {
                ...ue,
                subjects: ue.subjects.map((subject) => {
                  if (subject.id !== subjectId) return subject;
                  return { ...subject, grade };
                }),
              };
            }),
          };
        })
      );
    },
    []
  );

  const handleReset = useCallback(() => {
    setSemesterData(JSON.parse(JSON.stringify(semesters)));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onReset={handleReset} />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={semesterData[0].id} className="space-y-6">
          <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl">
            {semesterData.map((semester) => (
              <TabsTrigger
                key={semester.id}
                value={semester.id}
                className="data-[state=active]:bg-card data-[state=active]:shadow-soft rounded-lg px-6 py-3 font-medium transition-all"
              >
                {semester.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {semesterData.map((semester) => (
            <TabsContent key={semester.id} value={semester.id} className="space-y-6">
              <SemesterOverview semester={semester} ues={semester.ues} />
              
              <div className="grid gap-6 md:grid-cols-2">
                {semester.ues.map((ue, index) => (
                  <div
                    key={ue.id}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <UECard
                      ue={ue}
                      onSubjectGradeChange={(subjectId, grade) =>
                        handleGradeChange(semester.id, ue.id, subjectId, grade)
                      }
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Modifie les données dans{" "}
            <code className="bg-muted px-2 py-0.5 rounded text-xs">
              src/data/curriculum.ts
            </code>{" "}
            pour personnaliser tes UE et matières
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

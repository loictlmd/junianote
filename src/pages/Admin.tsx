import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { useCurriculumAdmin } from "@/hooks/useCurriculumAdmin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Shield, BookOpen, GraduationCap, FileText, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
  { value: "primary", label: "Violet" },
  { value: "secondary", label: "Secondaire" },
  { value: "accent", label: "Accent" },
  { value: "success", label: "Vert" },
  { value: "warning", label: "Orange" },
  { value: "info", label: "Bleu" },
  { value: "purple", label: "Violet foncé" },
  { value: "cyan", label: "Cyan" },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const {
    classes,
    semesters,
    ues,
    subjects,
    evaluations,
    isLoading,
    addClass,
    deleteClass,
    addSemester,
    deleteSemester,
    addUE,
    deleteUE,
    addSubject,
    deleteSubject,
    addEvaluation,
    deleteEvaluation,
  } = useCurriculumAdmin();

  // Form states
  const [newClass, setNewClass] = useState({ code: "", name: "", full_name: "" });
  const [newSemester, setNewSemester] = useState({ class_id: "", code: "", name: "" });
  const [newUE, setNewUE] = useState({ semester_id: "", code: "", name: "", color: "primary", display_order: 0 });
  const [newSubject, setNewSubject] = useState({ ue_id: "", name: "", total_points: 100, display_order: 0 });
  const [newEvaluation, setNewEvaluation] = useState({ subject_id: "", name: "", coefficient: 0, max_points: 0, display_order: 0 });

  if (adminLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-5 h-5" />
              Accès refusé
            </CardTitle>
            <CardDescription>
              Vous n'avez pas les droits administrateur pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddClass = async () => {
    if (!newClass.code || !newClass.name || !newClass.full_name) return;
    await addClass(newClass);
    setNewClass({ code: "", name: "", full_name: "" });
  };

  const handleAddSemester = async () => {
    if (!newSemester.class_id || !newSemester.code || !newSemester.name) return;
    await addSemester(newSemester);
    setNewSemester({ class_id: "", code: "", name: "" });
  };

  const handleAddUE = async () => {
    if (!newUE.semester_id || !newUE.code || !newUE.name) return;
    await addUE(newUE);
    setNewUE({ semester_id: "", code: "", name: "", color: "primary", display_order: 0 });
  };

  const handleAddSubject = async () => {
    if (!newSubject.ue_id || !newSubject.name) return;
    await addSubject(newSubject);
    setNewSubject({ ue_id: "", name: "", total_points: 100, display_order: 0 });
  };

  const handleAddEvaluation = async () => {
    if (!newEvaluation.subject_id || !newEvaluation.name) return;
    await addEvaluation(newEvaluation);
    setNewEvaluation({ subject_id: "", name: "", coefficient: 0, max_points: 0, display_order: 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Administration
            </h1>
            <p className="text-muted-foreground">Gérer les presets de curriculum</p>
          </div>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="classes" className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Classes</span>
            </TabsTrigger>
            <TabsTrigger value="semesters" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Semestres</span>
            </TabsTrigger>
            <TabsTrigger value="ues" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">UEs</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-1">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Matières</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Évals</span>
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une classe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input
                      placeholder="hei341"
                      value={newClass.code}
                      onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom court</Label>
                    <Input
                      placeholder="HEI 341"
                      value={newClass.name}
                      onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input
                      placeholder="HEI 3 - Groupe 41"
                      value={newClass.full_name}
                      onChange={(e) => setNewClass({ ...newClass, full_name: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddClass} disabled={!newClass.code || !newClass.name}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Classes existantes ({classes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {classes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune classe dans la base de données.</p>
                ) : (
                  <div className="space-y-2">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <Badge variant="outline" className="mr-2">{cls.code}</Badge>
                          <span className="font-medium">{cls.name}</span>
                          <span className="text-muted-foreground ml-2">- {cls.full_name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteClass(cls.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Semesters Tab */}
          <TabsContent value="semesters" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un semestre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Classe</Label>
                    <Select value={newSemester.class_id} onValueChange={(v) => setNewSemester({ ...newSemester, class_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input
                      placeholder="s6"
                      value={newSemester.code}
                      onChange={(e) => setNewSemester({ ...newSemester, code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      placeholder="Semestre 6"
                      value={newSemester.name}
                      onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddSemester} disabled={!newSemester.class_id || !newSemester.code}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Semestres existants ({semesters.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {semesters.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucun semestre.</p>
                ) : (
                  <div className="space-y-2">
                    {semesters.map((sem) => {
                      const cls = classes.find(c => c.id === sem.class_id);
                      return (
                        <div key={sem.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <Badge variant="outline" className="mr-2">{cls?.name || "?"}</Badge>
                            <span className="font-medium">{sem.name}</span>
                            <span className="text-muted-foreground ml-2">({sem.code})</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteSemester(sem.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* UEs Tab */}
          <TabsContent value="ues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une UE</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Semestre</Label>
                    <Select value={newUE.semester_id} onValueChange={(v) => setNewUE({ ...newUE, semester_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => {
                          const cls = classes.find(c => c.id === sem.class_id);
                          return (
                            <SelectItem key={sem.id} value={sem.id}>
                              {cls?.name} - {sem.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input
                      placeholder="UE1"
                      value={newUE.code}
                      onChange={(e) => setNewUE({ ...newUE, code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      placeholder="CME"
                      value={newUE.name}
                      onChange={(e) => setNewUE({ ...newUE, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Couleur</Label>
                    <Select value={newUE.color} onValueChange={(v) => setNewUE({ ...newUE, color: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLOR_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAddUE} disabled={!newUE.semester_id || !newUE.code}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UEs existantes ({ues.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {ues.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune UE.</p>
                ) : (
                  <div className="space-y-2">
                    {ues.map((ue) => {
                      const sem = semesters.find(s => s.id === ue.semester_id);
                      const cls = sem ? classes.find(c => c.id === sem.class_id) : null;
                      return (
                        <div key={ue.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{cls?.name} - {sem?.name}</Badge>
                            <Badge className={cn("bg-" + ue.color, "text-" + ue.color + "-foreground")}>{ue.code}</Badge>
                            <span className="font-medium">{ue.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteUE(ue.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une matière</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>UE</Label>
                    <Select value={newSubject.ue_id} onValueChange={(v) => setNewSubject({ ...newSubject, ue_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {ues.map((ue) => {
                          const sem = semesters.find(s => s.id === ue.semester_id);
                          const cls = sem ? classes.find(c => c.id === sem.class_id) : null;
                          return (
                            <SelectItem key={ue.id} value={ue.id}>
                              {cls?.name} - {ue.code} {ue.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      placeholder="Nom de la matière"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Points total</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={newSubject.total_points}
                      onChange={(e) => setNewSubject({ ...newSubject, total_points: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddSubject} disabled={!newSubject.ue_id || !newSubject.name}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Matières existantes ({subjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {subjects.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune matière.</p>
                ) : (
                  <div className="space-y-2">
                    {subjects.map((subj) => {
                      const ue = ues.find(u => u.id === subj.ue_id);
                      return (
                        <div key={subj.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <Badge variant="outline" className="mr-2">{ue?.code || "?"}</Badge>
                            <span className="font-medium">{subj.name}</span>
                            <span className="text-muted-foreground ml-2">({subj.total_points} pts)</span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteSubject(subj.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluations Tab */}
          <TabsContent value="evaluations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter une évaluation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Matière</Label>
                    <Select value={newEvaluation.subject_id} onValueChange={(v) => setNewEvaluation({ ...newEvaluation, subject_id: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subj) => {
                          const ue = ues.find(u => u.id === subj.ue_id);
                          return (
                            <SelectItem key={subj.id} value={subj.id}>
                              {ue?.code} - {subj.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      placeholder="P1, TP1, CC..."
                      value={newEvaluation.name}
                      onChange={(e) => setNewEvaluation({ ...newEvaluation, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Coefficient</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="30"
                      value={newEvaluation.coefficient}
                      onChange={(e) => setNewEvaluation({ ...newEvaluation, coefficient: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max points</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="30"
                      value={newEvaluation.max_points}
                      onChange={(e) => setNewEvaluation({ ...newEvaluation, max_points: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddEvaluation} disabled={!newEvaluation.subject_id || !newEvaluation.name}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Évaluations existantes ({evaluations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {evaluations.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune évaluation.</p>
                ) : (
                  <div className="space-y-2">
                    {evaluations.map((ev) => {
                      const subj = subjects.find(s => s.id === ev.subject_id);
                      const ue = subj ? ues.find(u => u.id === subj.ue_id) : null;
                      return (
                        <div key={ev.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <Badge variant="outline" className="mr-2">{ue?.code} - {subj?.name}</Badge>
                            <span className="font-medium">{ev.name}</span>
                            <span className="text-muted-foreground ml-2">
                              (coef: {ev.coefficient}, max: {ev.max_points})
                            </span>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => deleteEvaluation(ev.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;

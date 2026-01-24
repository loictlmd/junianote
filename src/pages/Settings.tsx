import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { classes } from "@/data/curriculum";
import { useUserProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings, User, BookOpen, GraduationCap, ArrowLeft, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, deleteProfile, isLoading } = useUserProfile();
  const { signOut } = useAuth();
  
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [selectedClass, setSelectedClass] = useState(profile?.class_id || "");
  const [selectedSemester, setSelectedSemester] = useState(profile?.semester_id || "");
  const [isSaving, setIsSaving] = useState(false);

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const availableSemesters = selectedClassData?.semesters || [];

  const isFormValid = firstName.trim() && lastName.trim() && selectedClass && selectedSemester;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !profile) return;
    setIsSaving(true);

    const { error } = await updateProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      class_id: selectedClass,
      semester_id: selectedSemester,
    });

    setIsSaving(false);

    if (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    } else {
      toast.success("Profil mis à jour !");
      navigate("/");
    }
  };

  const handleDeleteProfile = async () => {
    const { error } = await deleteProfile();
    
    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      await signOut();
      toast.success("Compte supprimé");
      navigate("/auth");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!profile) {
    navigate("/setup");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-lg space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              Paramètres
            </h1>
            <p className="text-muted-foreground">Modifie ton profil étudiant</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Modifie tes informations et ta classe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="Ton prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Ton nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Class selection */}
              <div className="space-y-2">
                <Label htmlFor="class" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Classe
                </Label>
                <Select value={selectedClass} onValueChange={(value) => {
                  setSelectedClass(value);
                  setSelectedSemester(""); // Reset semester when class changes
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionne ta classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name} - {classItem.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Semester selection */}
              <div className="space-y-2">
                <Label htmlFor="semester" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Semestre
                </Label>
                <Select 
                  value={selectedSemester} 
                  onValueChange={setSelectedSemester}
                  disabled={!selectedClass}
                >
                  <SelectTrigger className={cn(!selectedClass && "opacity-50")}>
                    <SelectValue placeholder={selectedClass ? "Sélectionne ton semestre" : "Choisis d'abord une classe"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSemesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Save button */}
              <Button 
                type="submit" 
                className="w-full"
                disabled={!isFormValid || isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-2 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Zone dangereuse
            </CardTitle>
            <CardDescription>
              Actions irréversibles sur ton compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer mon profil et mes données
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer ton profil ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes tes notes sauvegardées seront supprimées.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProfile} className="bg-destructive hover:bg-destructive/90">
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

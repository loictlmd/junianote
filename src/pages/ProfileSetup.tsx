import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { classes, StudentProfile } from "@/data/curriculum";
import { useUserProfile } from "@/hooks/useProfile";
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
import { GraduationCap, User, BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { profile, isLoading, createProfile } = useUserProfile();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already has profile
  useEffect(() => {
    if (!isLoading && profile) {
      navigate("/");
    }
  }, [isLoading, profile, navigate]);

  const selectedClassData = classes.find(c => c.id === selectedClass);
  const availableSemesters = selectedClassData?.semesters || [];

  const isFormValid = firstName.trim() && lastName.trim() && selectedClass && selectedSemester;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    setIsSubmitting(true);

    const { error } = await createProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      class_id: selectedClass,
      semester_id: selectedSemester,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Erreur lors de la création du profil");
    } else {
      toast.success("Profil créé avec succès !");
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-soft mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text">JUNIA Note</h1>
          <p className="text-muted-foreground">Configure ton profil pour commencer</p>
        </div>

        {/* Form Card */}
        <Card className="border-2 border-primary/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Création du profil
            </CardTitle>
            <CardDescription>
              Ces informations nous permettent de personnaliser ton expérience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full group"
                disabled={!isFormValid || isSubmitting}
                size="lg"
              >
                {isSubmitting ? "Création..." : "Commencer"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Tu pourras modifier ces informations plus tard dans les paramètres
        </p>
      </div>
    </div>
  );
};

export default ProfileSetup;

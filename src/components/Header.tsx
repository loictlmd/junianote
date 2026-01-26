import { Calculator, RotateCcw, Settings, Save, LogOut, Moon, Sun, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface HeaderProps {
  onReset: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

const Header = ({ onReset, onSave, isSaving, hasUnsavedChanges }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/auth");
  };

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-primary to-secondary shadow-soft"
            )}>
              <Calculator className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display gradient-text">
                JUNIA Note
              </h1>
              <p className="text-sm text-muted-foreground">
                Calculer votre moyenne
              </p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            {onSave && (
              <Button
                variant={hasUnsavedChanges ? "default" : "outline"}
                size="sm"
                onClick={onSave}
                disabled={isSaving || !hasUnsavedChanges}
                className={cn(
                  "gap-2",
                  hasUnsavedChanges && "animate-pulse"
                )}
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isSaving ? "Sauvegarde..." : "Enregistrer"}
                </span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={isDark ? "Mode clair" : "Mode sombre"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link to="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>

            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                title="Administration"
              >
                <Link to="/admin">
                  <Shield className="w-5 h-5 text-primary" />
                </Link>
              </Button>
            )}

            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

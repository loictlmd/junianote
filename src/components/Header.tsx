import { Calculator, RotateCcw, Settings, Save, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface HeaderProps {
  onReset: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

const Header = ({ onReset, onSave, isSaving, hasUnsavedChanges }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

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
                MoyenneCalc
              </h1>
              <p className="text-sm text-muted-foreground">
                Calculateur de moyennes universitaires
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
              asChild
            >
              <Link to="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>

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

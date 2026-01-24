import { Calculator, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface HeaderProps {
  onReset: () => void;
}

const Header = ({ onReset }: HeaderProps) => {
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

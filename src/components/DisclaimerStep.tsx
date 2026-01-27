import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface DisclaimerStepProps {
  onAccept: () => void;
}

const DisclaimerStep = ({ onAccept }: DisclaimerStepProps) => {
  const [accepted, setAccepted] = useState(false);

  return (
    <Card className="border-2 border-warning/30 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-warning">
          <AlertTriangle className="w-5 h-5" />
          Avertissement / Mention légale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
          <p>
            Ce site est un outil d'aide au calcul des moyennes d'UE fourni à titre <strong>strictement indicatif</strong>.
          </p>
          <p>
            Les résultats affichés sont donnés à titre informatif et <strong>n'ont aucune valeur officielle</strong>. Ils ne peuvent en aucun cas se substituer aux relevés de notes, décisions pédagogiques ou validations de semestre communiqués par JUNIA.
          </p>
          <p>
            Ce site est <strong>indépendant de JUNIA</strong>, n'est ni édité, ni validé, ni approuvé par l'établissement.
          </p>
          <p>
            Aucune décision administrative ou pédagogique (validation d'UE, de semestre ou d'année) ne doit être prise sur la base des résultats fournis par cet outil.
          </p>
          <p>
            L'éditeur du site ne saurait être tenu responsable d'éventuelles erreurs de calcul, d'interprétation ou d'utilisation des résultats.
          </p>
        </div>

        <div className="flex items-start space-x-3 pt-4 border-t">
          <Checkbox
            id="disclaimer-accept"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
          />
          <Label
            htmlFor="disclaimer-accept"
            className="text-sm font-medium leading-relaxed cursor-pointer"
          >
            J'ai compris que les résultats sont donnés à titre indicatif et n'ont aucune valeur officielle.
          </Label>
        </div>

        <Button
          onClick={onAccept}
          disabled={!accepted}
          className="w-full group"
          size="lg"
        >
          Continuer
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default DisclaimerStep;

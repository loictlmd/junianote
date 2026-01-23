// Structure des UE et matières pour HEI 3 Semestre 6 - 2025-2026
// Tu peux modifier ces données selon ta maquette pédagogique

export interface Subject {
  id: string;
  name: string;
  coefficient: number;
  grade?: number;
}

export interface UE {
  id: string;
  name: string;
  code: string;
  credits: number;
  subjects: Subject[];
  color: string;
}

export interface Semester {
  id: string;
  name: string;
  ues: UE[];
}

export const semesters: Semester[] = [
  {
    id: "s6",
    name: "Semestre 6 - HEI 3",
    ues: [
      {
        id: "ue1",
        name: "Sciences de l'Ingénieur",
        code: "UE 6.1",
        credits: 6,
        color: "primary",
        subjects: [
          { id: "s1-1", name: "Mathématiques Appliquées", coefficient: 2 },
          { id: "s1-2", name: "Physique des Matériaux", coefficient: 2 },
          { id: "s1-3", name: "Mécanique des Fluides", coefficient: 1 },
        ],
      },
      {
        id: "ue2",
        name: "Technologies Numériques",
        code: "UE 6.2",
        credits: 5,
        color: "secondary",
        subjects: [
          { id: "s2-1", name: "Programmation Avancée", coefficient: 2 },
          { id: "s2-2", name: "Bases de Données", coefficient: 1.5 },
          { id: "s2-3", name: "Réseaux et Systèmes", coefficient: 1.5 },
        ],
      },
      {
        id: "ue3",
        name: "Management et Communication",
        code: "UE 6.3",
        credits: 4,
        color: "accent",
        subjects: [
          { id: "s3-1", name: "Gestion de Projet", coefficient: 1.5 },
          { id: "s3-2", name: "Communication Professionnelle", coefficient: 1 },
          { id: "s3-3", name: "Anglais Technique", coefficient: 1.5 },
        ],
      },
      {
        id: "ue4",
        name: "Spécialisation",
        code: "UE 6.4",
        credits: 8,
        color: "success",
        subjects: [
          { id: "s4-1", name: "Électronique de Puissance", coefficient: 2 },
          { id: "s4-2", name: "Automatique", coefficient: 2 },
          { id: "s4-3", name: "Énergies Renouvelables", coefficient: 2 },
          { id: "s4-4", name: "Projet Technique", coefficient: 2 },
        ],
      },
      {
        id: "ue5",
        name: "Stage et Projet Professionnel",
        code: "UE 6.5",
        credits: 7,
        color: "warning",
        subjects: [
          { id: "s5-1", name: "Stage en Entreprise", coefficient: 4 },
          { id: "s5-2", name: "Rapport et Soutenance", coefficient: 2 },
          { id: "s5-3", name: "Portfolio Compétences", coefficient: 1 },
        ],
      },
    ],
  },
];

export const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
  };
  return colorMap[color] || colorMap.primary;
};

export const getColorBorderClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    primary: "border-primary/30",
    secondary: "border-secondary/30",
    accent: "border-accent/30",
    success: "border-success/30",
    warning: "border-warning/30",
  };
  return colorMap[color] || colorMap.primary;
};

export const getColorBgClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10",
    secondary: "bg-secondary/10",
    accent: "bg-accent/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
  };
  return colorMap[color] || colorMap.primary;
};

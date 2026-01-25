// Structure des UE et matières pour différentes classes
// Ajouter de nouvelles classes en suivant le même format

export interface Evaluation {
  id: string;
  name: string;
  coefficient: number;
  grade?: number; // Note sur 20
  maxPoints: number;
}

export interface Subject {
  id: string;
  name: string;
  totalPoints: number;
  evaluations: Evaluation[];
}

export interface UE {
  id: string;
  name: string;
  code: string;
  subjects: Subject[];
  color: string;
}

export interface Semester {
  id: string;
  name: string;
  ues: UE[];
}

export interface ClassData {
  id: string;
  name: string;
  fullName: string;
  semesters: Semester[];
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  classId: string;
  semesterId: string;
  createdAt: string;
}

// Données pour HEI 341 - Semestre 6
const hei341Semester6: Semester = {
  id: "s6",
  name: "Semestre 6",
  ues: [
    {
      id: "ue1-cme",
      name: "CME",
      code: "UE1",
      color: "primary",
      subjects: [
        {
          id: "cme8",
          name: "Un monde en transition : la place de la chimie",
          totalPoints: 100,
          evaluations: [
            { id: "cme8-p1", name: "P1", coefficient: 30, maxPoints: 30 },
            { id: "cme8-p2", name: "P2", coefficient: 30, maxPoints: 30 },
            { id: "cme8-projet", name: "Projet", coefficient: 40, maxPoints: 40 },
          ],
        },
      ],
    },
    {
      id: "ue2-eea",
      name: "EEA",
      code: "UE2",
      color: "secondary",
      subjects: [
        {
          id: "eea1",
          name: "Électricité, vecteur d'énergie",
          totalPoints: 100,
          evaluations: [
            { id: "eea1-p1", name: "P1", coefficient: 20, maxPoints: 20 },
            { id: "eea1-p2", name: "P2", coefficient: 50, maxPoints: 50 },
            { id: "eea1-tp1", name: "TP1", coefficient: 10, maxPoints: 10 },
            { id: "eea1-tp2", name: "TP2", coefficient: 10, maxPoints: 10 },
            { id: "eea1-tp3", name: "TP3", coefficient: 10, maxPoints: 10 },
          ],
        },
      ],
    },
    {
      id: "ue3-mfe",
      name: "MFE",
      code: "UE3",
      color: "accent",
      subjects: [
        {
          id: "mfe3",
          name: "Résistance des matériaux",
          totalPoints: 100,
          evaluations: [
            { id: "mfe3-p1", name: "P1", coefficient: 35, maxPoints: 35 },
            { id: "mfe3-p2", name: "P2", coefficient: 35, maxPoints: 35 },
            { id: "mfe3-tp1", name: "TP1", coefficient: 15, maxPoints: 15 },
            { id: "mfe3-tp2", name: "TP2", coefficient: 15, maxPoints: 15 },
          ],
        },
      ],
    },
    {
      id: "ue4-ndc",
      name: "NDC",
      code: "UE4",
      color: "success",
      subjects: [
        {
          id: "ndc6",
          name: "Analyse de données",
          totalPoints: 100,
          evaluations: [
            { id: "ndc6-p1", name: "P1", coefficient: 35, maxPoints: 35 },
            { id: "ndc6-p2", name: "P2", coefficient: 35, maxPoints: 35 },
            { id: "ndc6-projet", name: "Projet", coefficient: 30, maxPoints: 30 },
          ],
        },
      ],
    },
    {
      id: "ue5-ome",
      name: "OME",
      code: "UE5",
      color: "warning",
      subjects: [
        {
          id: "ome-eco",
          name: "Économie d'entreprise",
          totalPoints: 35,
          evaluations: [
            { id: "ome-eco-p1", name: "P1", coefficient: 35, maxPoints: 35 },
          ],
        },
        {
          id: "ome-compta",
          name: "Comptabilité",
          totalPoints: 30,
          evaluations: [
            { id: "ome-compta-p1", name: "P1", coefficient: 30, maxPoints: 30 },
          ],
        },
        {
          id: "ome-marketing",
          name: "Fondamentaux du marketing",
          totalPoints: 35,
          evaluations: [
            { id: "ome-marketing-p1", name: "P1", coefficient: 10.5, maxPoints: 10.5 },
            { id: "ome-marketing-cc", name: "CC", coefficient: 7, maxPoints: 7 },
            { id: "ome-marketing-projet", name: "Projet", coefficient: 17.5, maxPoints: 17.5 },
          ],
        },
      ],
    },
    {
      id: "ue6-hl",
      name: "HL",
      code: "UE6",
      color: "info",
      subjects: [
        {
          id: "hl-anglais",
          name: "Anglais",
          totalPoints: 25,
          evaluations: [
            { id: "hl-anglais-cc", name: "CC", coefficient: 25, maxPoints: 25 },
          ],
        },
        {
          id: "hl-lv2",
          name: "LV2 / FLE",
          totalPoints: 20,
          evaluations: [
            { id: "hl-lv2-cc", name: "CC", coefficient: 20, maxPoints: 20 },
          ],
        },
        {
          id: "hl-competences",
          name: "Compétences relationnelles 2",
          totalPoints: 20,
          evaluations: [
            { id: "hl-competences-cc", name: "CC", coefficient: 20, maxPoints: 20 },
          ],
        },
        {
          id: "hl-decryptage",
          name: "Décryptage de l'information & enjeux de société",
          totalPoints: 50,
          evaluations: [
            { id: "hl-decryptage-cc", name: "CC", coefficient: 25, maxPoints: 25 },
            { id: "hl-decryptage-projet", name: "Projet", coefficient: 25, maxPoints: 25 },
          ],
        },
        {
          id: "hl-ppj",
          name: "PPJ",
          totalPoints: 10,
          evaluations: [
            { id: "hl-ppj-validation", name: "Validation", coefficient: 10, maxPoints: 10 },
          ],
        },
      ],
    },
    {
      id: "ue7-inter",
      name: "Internationalisation",
      code: "UE7",
      color: "purple",
      subjects: [
        {
          id: "inter-culture",
          name: "Interculturalité",
          totalPoints: 50,
          evaluations: [
            { id: "inter-culture-cc1", name: "CC1", coefficient: 20, maxPoints: 20 },
            { id: "inter-culture-cc2", name: "CC2", coefficient: 30, maxPoints: 30 },
          ],
        },
        {
          id: "inter-ib",
          name: "Préparation IB",
          totalPoints: 50,
          evaluations: [
            { id: "inter-ib-soutenance", name: "Soutenance", coefficient: 20, maxPoints: 20 },
            { id: "inter-ib-projet", name: "Projet", coefficient: 30, maxPoints: 30 },
          ],
        },
      ],
    },
    {
      id: "ue10-tech",
      name: "Ouvertures Techniques",
      code: "UE10",
      color: "cyan",
      subjects: [
        {
          id: "tech-ia",
          name: "Intelligence Artificielle",
          totalPoints: 50,
          evaluations: [
            { id: "tech-ia-p1", name: "P1", coefficient: 35, maxPoints: 35 },
            { id: "tech-ia-projet", name: "Projet", coefficient: 15, maxPoints: 15 },
          ],
        },
        {
          id: "tech-cyber",
          name: "Cybersécurité",
          totalPoints: 50,
          evaluations: [
            { id: "tech-cyber-p1", name: "P1", coefficient: 25, maxPoints: 25 },
            { id: "tech-cyber-cc1", name: "CC1", coefficient: 10, maxPoints: 10 },
            { id: "tech-cyber-soutenance", name: "Soutenance", coefficient: 15, maxPoints: 15 },
          ],
        },
      ],
    },
  ],
};

// Liste de toutes les classes disponibles
export const classes: ClassData[] = [
  {
    id: "hei311",
    name: "HEI 311",
    fullName: "HEI 3 - Groupe 11",
    semesters: [hei341Semester6],
  },
  {
    id: "hei321",
    name: "HEI 321",
    fullName: "HEI 3 - Groupe 21",
    semesters: [hei341Semester6],
  },
  {
    id: "hei331",
    name: "HEI 331",
    fullName: "HEI 3 - Groupe 31",
    semesters: [hei341Semester6],
  },
  {
    id: "hei341",
    name: "HEI 341",
    fullName: "HEI 3 - Groupe 41",
    semesters: [hei341Semester6],
  },
];

// Fonctions utilitaires
export const getClassById = (classId: string): ClassData | undefined => {
  return classes.find((c) => c.id === classId);
};

export const getSemesterById = (classId: string, semesterId: string): Semester | undefined => {
  const classData = getClassById(classId);
  return classData?.semesters.find((s) => s.id === semesterId);
};

export const getColorClass = (color: string): string => {
  const colorMap: Record<string, string> = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    accent: "bg-accent text-accent-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    info: "bg-info text-info-foreground",
    purple: "bg-purple text-purple-foreground",
    cyan: "bg-cyan text-cyan-foreground",
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
    info: "border-info/30",
    purple: "border-purple/30",
    cyan: "border-cyan/30",
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
    info: "bg-info/10",
    purple: "bg-purple/10",
    cyan: "bg-cyan/10",
  };
  return colorMap[color] || colorMap.primary;
};

// Calcul des moyennes - Notes sur 20, pondérées par les coefficients
export const calculateSubjectAverage = (subject: Subject): number | null => {
  const evaluationsWithGrades = subject.evaluations.filter((e) => e.grade !== undefined);
  if (evaluationsWithGrades.length === 0) return null;

  // Chaque note est sur 20, pondérée par le coefficient (maxPoints)
  const weightedSum = evaluationsWithGrades.reduce((sum, e) => sum + (e.grade || 0) * e.maxPoints, 0);
  const totalWeight = evaluationsWithGrades.reduce((sum, e) => sum + e.maxPoints, 0);

  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
};

export const calculateUEAverage = (ue: UE): number | null => {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const subject of ue.subjects) {
    for (const evaluation of subject.evaluations) {
      if (evaluation.grade !== undefined) {
        weightedSum += evaluation.grade * evaluation.maxPoints;
        totalWeight += evaluation.maxPoints;
      }
    }
  }

  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
};

export const calculateOverallAverage = (ues: UE[]): number | null => {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const ue of ues) {
    for (const subject of ue.subjects) {
      for (const evaluation of subject.evaluations) {
        if (evaluation.grade !== undefined) {
          weightedSum += evaluation.grade * evaluation.maxPoints;
          totalWeight += evaluation.maxPoints;
        }
      }
    }
  }

  if (totalWeight === 0) return null;
  return weightedSum / totalWeight;
};

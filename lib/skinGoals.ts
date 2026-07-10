export const SKIN_GOAL_STORAGE_KEY = "skinorai_preferred_skin_goal";

export type SkinGoalId =
  | "hydration"
  | "acne"
  | "barrier"
  | "redness"
  | "oily"
  | "morning";

export type SkinGoalOption = {
  id: SkinGoalId;
  label: string;
  accentLabel: string;
  image: string;
  apiValue: string;
};

export const skinGoalOptions: SkinGoalOption[] = [
  {
    id: "hydration",
    label: "Hydratation",
    accentLabel: "hydrater et repulper",
    image: "/icons/hydratation.png",
    apiValue: "hydration",
  },
  {
    id: "acne",
    label: "Acne & imperfections",
    accentLabel: "cibler les imperfections",
    image: "/icons/acne.png",
    apiValue: "acne",
  },
  {
    id: "barrier",
    label: "Reparation de la barriere",
    accentLabel: "renforcer la barriere cutanee",
    image: "/icons/reparation.png",
    apiValue: "barrier_repair",
  },
  {
    id: "redness",
    label: "Rougeurs",
    accentLabel: "apaiser les rougeurs",
    image: "/icons/rougeurs.png",
    apiValue: "redness",
  },
  {
    id: "oily",
    label: "Peau grasse",
    accentLabel: "equilibrer l exces de sebum",
    image: "/icons/hydratation.png",
    apiValue: "oily_skin",
  },
  {
    id: "morning",
    label: "Routine du matin",
    accentLabel: "optimiser la routine du matin",
    image: "/icons/routine-matin.png",
    apiValue: "morning_routine",
  },
];

export function normalizeSkinGoalId(value: string | null | undefined): SkinGoalId | null {
  if (!value) {
    return null;
  }

  const match = skinGoalOptions.find((goal) => goal.id === value || goal.apiValue === value);
  return match?.id ?? null;
}

export function getSkinGoalOption(value: string | null | undefined) {
  const normalized = normalizeSkinGoalId(value);
  return normalized ? skinGoalOptions.find((goal) => goal.id === normalized) ?? null : null;
}

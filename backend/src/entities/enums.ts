export type Civility = "monsieur" | "madame" | "autre";

export type EmploymentStatus = "salarie" | "independant" | "retraite" | "autre";

export type ApplicationStatus = "nouveau" | "en_cours" | "approuve" | "refuse";

export type LoanPurpose =
  | "voiture"
  | "travaux"
  | "projet_professionnel"
  | "etudes"
  | "voyages"
  | "mariage"
  | "autre";

export type CardType = "classique" | "gold" | "premium";

export type AccountType = "particulier" | "professionnel";

// Type de produit de compte proposé lors de l'ouverture :
// - courant : compte courant classique
// - epargne_libre : épargne disponible à tout moment
// - epargne_bloquee : compte à terme bloqué, taux d'intérêt bonifié
export type AccountProductType = "courant" | "epargne_libre" | "epargne_bloquee";

export type RiskProfile = "faible" | "modere" | "eleve";

export type InvestmentGoal = "court_terme" | "moyen_terme" | "long_terme";

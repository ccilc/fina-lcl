export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}

export interface LoanSimulationResponse {
  input: {
    amount: number;
    durationMonths: number;
    loanType: "personnel" | "professionnel";
    interestRate: number;
  };
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  debtRatioPercent: number | null;
  schedule: AmortizationRow[];
}

export interface SavingsSimulationResponse {
  id: string;
  interestRate: number;
  totalDeposited: number;
  totalInterest: number;
  finalCapital: number;
}

export interface PersonalLoanForm {
  civility: "monsieur" | "madame" | "autre";
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  employmentStatus: "salarie" | "independant" | "retraite" | "autre";
  employer?: string;
  monthlyIncome: number;
  seniority?: string;
  loanAmount: number;
  loanDurationMonths: number;
  loanPurpose: "voiture" | "travaux" | "projet_professionnel" | "etudes" | "voyages" | "mariage" | "autre";
  loanPurposeOther?: string;
  consentDataUsage: boolean;
  consentMarketing: boolean;
}

export interface ProfessionalLoanForm {
  civility: "monsieur" | "madame" | "autre";
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  registrationNumber?: string;
  sector?: string;
  loanType: "creation_entreprise" | "investissement" | "tresorerie" | "developpement";
  loanAmount: number;
  loanDurationMonths: number;
  projectDescription?: string;
  consentDataUsage: boolean;
  consentMarketing: boolean;
}

export interface CardRequestForm {
  cardType: "classique" | "gold" | "premium";
  fullName: string;
  email: string;
  phone: string;
}

export type AccountProductType = "courant" | "epargne_libre" | "epargne_bloquee";

export interface AccountRequestForm {
  fullName: string;
  email: string;
  phone: string;
  accountType: "particulier" | "professionnel";
  productType: AccountProductType;
  lockDurationMonths?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "advisor" | "client";
  status: "en_attente" | "actif" | "rejete";
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  productType: AccountProductType;
  balance: number;
  interestRate: number;
  lockDurationMonths?: number;
  lockEndDate?: string;
  status: "actif" | "cloture";
  createdAt: string;
}

export interface AccountTransaction {
  id: string;
  bankAccountId: string;
  type: "credit_pret" | "depot" | "interet" | "virement_sortant";
  amount: number;
  description?: string;
  balanceAfter: number;
  createdAt: string;
}

export interface TransferRequestForm {
  bankAccountId: string;
  amount: number;
  beneficiaryBankName: string;
  beneficiaryIban: string;
}

export interface TransferRequestItem {
  id: string;
  bankAccountId: string;
  userId: string;
  amount: number;
  beneficiaryBankName: string;
  beneficiaryIban: string;
  status: "en_attente" | "validee" | "rejetee";
  reviewNote?: string;
  createdAt: string;
}

export interface ClientSummary {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  status: "en_attente" | "actif" | "rejete";
  createdAt: string;
}

export interface InvestmentAccountForm {
  fullName: string;
  email: string;
  phone: string;
  riskProfile: "faible" | "modere" | "eleve";
  investmentGoal: "court_terme" | "moyen_terme" | "long_terme";
}

export interface WebinarRegistrationForm {
  fullName: string;
  email: string;
  webinarDate: string;
}

export interface ContactForm {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ApiMessage {
  message: string;
  id?: string;
}

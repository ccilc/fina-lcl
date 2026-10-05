export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}

export interface LoanSimulationResult {
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

/**
 * Calcule la mensualité fixe d'un prêt amortissable (formule des annuités),
 * conforme au simulateur décrit dans la page "Simulateur de prêt" :
 *   M = C * t / (1 - (1 + t)^-n)
 */
export function computeMonthlyPayment(
  principal: number,
  annualInterestRatePercent: number,
  durationMonths: number
): number {
  if (principal <= 0 || durationMonths <= 0) return 0;

  const monthlyRate = annualInterestRatePercent / 100 / 12;

  if (monthlyRate === 0) {
    return round2(principal / durationMonths);
  }

  const payment =
    (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -durationMonths));

  return round2(payment);
}

/**
 * Génère l'échéancier de remboursement détaillé (mois par mois).
 */
export function buildAmortizationSchedule(
  principal: number,
  annualInterestRatePercent: number,
  durationMonths: number
): LoanSimulationResult {
  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const monthlyPayment = computeMonthlyPayment(
    principal,
    annualInterestRatePercent,
    durationMonths
  );

  let remaining = principal;
  const schedule: AmortizationRow[] = [];
  let totalInterest = 0;

  for (let month = 1; month <= durationMonths; month++) {
    const interest = round2(remaining * monthlyRate);
    let principalPaid = round2(monthlyPayment - interest);

    // Ajuste la dernière mensualité pour absorber les écarts d'arrondi
    if (month === durationMonths) {
      principalPaid = remaining;
    }

    remaining = round2(remaining - principalPaid);
    if (remaining < 0) remaining = 0;

    totalInterest = round2(totalInterest + interest);

    schedule.push({
      month,
      payment: month === durationMonths ? round2(principalPaid + interest) : monthlyPayment,
      interest,
      principal: principalPaid,
      remainingBalance: remaining,
    });
  }

  const totalCost = round2(principal + totalInterest);

  return {
    monthlyPayment,
    totalCost,
    totalInterest,
    schedule,
  };
}

/**
 * Calcule un plan d'épargne (versements mensuels + intérêts composés),
 * conforme au simulateur décrit dans la page "Comptes courants et épargne".
 * La durée est exprimée directement en mois.
 */
export function computeSavingsPlan(
  monthlyAmount: number,
  durationMonths: number,
  annualInterestRatePercent: number
) {
  const months = durationMonths;
  const monthlyRate = annualInterestRatePercent / 100 / 12;

  let capital = 0;
  let totalDeposited = 0;

  for (let m = 1; m <= months; m++) {
    capital += monthlyAmount;
    capital *= 1 + monthlyRate;
    totalDeposited += monthlyAmount;
  }

  const finalCapital = round2(capital);
  const totalInterest = round2(finalCapital - totalDeposited);

  return {
    finalCapital,
    totalDeposited: round2(totalDeposited),
    totalInterest,
  };
}

/**
 * Détermine un taux d'intérêt indicatif selon le type de prêt et le profil,
 * utilisé par défaut lorsque l'utilisateur n'en précise pas.
 */
export function estimateIndicativeRate(loanType: "personnel" | "professionnel"): number {
  return loanType === "personnel" ? 3.5 : 4.2;
}

/**
 * Grille de taux pour l'épargne bloquée (compte à terme) : plus la durée de
 * blocage est longue, meilleur est le taux proposé au client.
 */
export function estimateBlockedSavingsRate(lockDurationMonths: number): number {
  if (lockDurationMonths >= 60) return 5.5; // 5 ans et plus
  if (lockDurationMonths >= 36) return 4.5; // 3 à 5 ans
  if (lockDurationMonths >= 24) return 3.8; // 2 à 3 ans
  if (lockDurationMonths >= 12) return 3.0; // 1 à 2 ans
  if (lockDurationMonths >= 6) return 2.0; // 6 à 12 mois
  return 1.2; // moins de 6 mois
}

/** Taux indicatif pour l'épargne libre (disponible à tout moment). */
export const FREE_SAVINGS_RATE = 1.5;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

import api from "./api";
import type {
  LoanSimulationResponse,
  PersonalLoanForm,
  ProfessionalLoanForm,
  ApiMessage,
} from "@/types/api";

export async function simulateLoan(payload: {
  amount: number;
  durationMonths: number;
  loanType: "personnel" | "professionnel";
  interestRate?: number;
  monthlyIncome?: number;
}): Promise<LoanSimulationResponse> {
  const { data } = await api.post<LoanSimulationResponse>("/loans/simulate", payload);
  return data;
}

export async function submitPersonalLoan(payload: PersonalLoanForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/loans/personal", payload);
  return data;
}

export async function submitProfessionalLoan(payload: ProfessionalLoanForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/loans/professional", payload);
  return data;
}

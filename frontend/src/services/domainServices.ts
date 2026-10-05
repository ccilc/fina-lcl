import api from "./api";
import type {
  CardRequestForm,
  AccountRequestForm,
  InvestmentAccountForm,
  WebinarRegistrationForm,
  ContactForm,
  ApiMessage,
  SavingsSimulationResponse,
} from "@/types/api";

export async function submitCardRequest(payload: CardRequestForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/cards", payload);
  return data;
}

export async function submitAccountRequest(payload: AccountRequestForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/accounts", payload);
  return data;
}

export async function simulateSavings(payload: {
  monthlyAmount: number;
  durationMonths: number;
  interestRate?: number;
  email?: string;
}): Promise<SavingsSimulationResponse> {
  const { data } = await api.post<SavingsSimulationResponse>(
    "/accounts/savings-simulation",
    payload
  );
  return data;
}

export async function submitInvestmentAccount(payload: InvestmentAccountForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/investments/accounts", payload);
  return data;
}

export async function registerWebinar(payload: WebinarRegistrationForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/investments/webinars", payload);
  return data;
}

export async function submitContactMessage(payload: ContactForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/contact", payload);
  return data;
}

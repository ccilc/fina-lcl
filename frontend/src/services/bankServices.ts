import api from "./api";
import type {
  BankAccount,
  AccountTransaction,
  TransferRequestForm,
  TransferRequestItem,
  ApiMessage,
} from "@/types/api";

export async function getMyBankAccounts(): Promise<BankAccount[]> {
  const { data } = await api.get<BankAccount[]>("/bank-accounts");
  return data;
}

export async function getAccountTransactions(
  accountId: string
): Promise<{ account: BankAccount; transactions: AccountTransaction[] }> {
  const { data } = await api.get(`/bank-accounts/${accountId}/transactions`);
  return data;
}

export async function createTransferRequest(payload: TransferRequestForm): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>("/transfers", payload);
  return data;
}

export async function getMyTransferRequests(): Promise<TransferRequestItem[]> {
  const { data } = await api.get<TransferRequestItem[]>("/transfers");
  return data;
}

import api from "./api";
import type { ClientSummary, ApiMessage } from "@/types/api";

export async function listClients(status?: string): Promise<ClientSummary[]> {
  const { data } = await api.get<ClientSummary[]>("/admin/clients", { params: { status } });
  return data;
}

export async function approveClient(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/clients/${id}/approve`);
  return data;
}

export async function rejectClient(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/clients/${id}/reject`);
  return data;
}

export async function approveAccountRequest(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/account-requests/${id}/approve`);
  return data;
}

export async function rejectAccountRequest(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/account-requests/${id}/reject`);
  return data;
}

export async function approvePersonalLoan(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/personal-loans/${id}/approve`);
  return data;
}

export async function rejectPersonalLoan(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/personal-loans/${id}/reject`);
  return data;
}

export async function approveProfessionalLoan(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/professional-loans/${id}/approve`);
  return data;
}

export async function rejectProfessionalLoan(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/professional-loans/${id}/reject`);
  return data;
}

export async function approveTransfer(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/transfers/${id}/approve`);
  return data;
}

export async function rejectTransfer(id: string): Promise<ApiMessage> {
  const { data } = await api.patch<ApiMessage>(`/admin/transfers/${id}/reject`);
  return data;
}

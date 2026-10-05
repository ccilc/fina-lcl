<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("common.brand") }}</p>
      <h1>{{ t("dashboard.adminTitle") }}</h1>
      <p class="hero__subtitle">{{ t("dashboard.welcome") }}, {{ user?.fullName }}.</p>

      <div class="card" style="margin-top: 2rem">
        <h2>{{ t("dashboard.pendingClients") }}</h2>
        <p v-if="pendingClients.length === 0" class="hero__subtitle">
          {{ t("dashboard.noPendingClients") }}
        </p>
        <div class="table-wrap" v-else>
          <table>
            <thead>
              <tr>
                <th>{{ t("auth.fullName") }}</th>
                <th>{{ t("auth.email") }}</th>
                <th>{{ t("auth.phone") }}</th>
                <th>{{ t("myRequests.date") }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="client in pendingClients" :key="client.id">
                <td>{{ client.fullName }}</td>
                <td>{{ client.email }}</td>
                <td>{{ client.phone || "—" }}</td>
                <td>{{ formatDate(client.createdAt) }}</td>
                <td class="actions">
                  <button class="btn btn--primary btn--sm" @click="onApproveClient(client.id)">
                    {{ t("dashboard.approve") }}
                  </button>
                  <button class="btn btn--outline btn--sm" @click="onRejectClient(client.id)">
                    {{ t("dashboard.reject") }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-top: 2rem">
        <h2>{{ t("dashboard.allRequestsTitle") }}</h2>

        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-button"
            :class="{ 'tab-button--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <p v-if="loadingTab">{{ t("common.loading") }}</p>
        <div class="table-wrap" v-else-if="currentItems.length > 0">
          <table>
            <thead>
              <tr>
                <th v-for="col in currentTab.columns" :key="col.key">{{ col.label }}</th>
                <th>{{ t("myRequests.status") }}</th>
                <th>{{ t("myRequests.date") }}</th>
                <th v-if="currentTab.approvable"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in currentItems" :key="item.id">
                <td v-for="col in currentTab.columns" :key="col.key">
                  {{ col.format ? col.format(item[col.key]) : item[col.key] }}
                </td>
                <td>{{ item.status }}</td>
                <td>{{ formatDate(item.createdAt) }}</td>
                <td v-if="currentTab.approvable" class="actions">
                  <button
                    v-if="item.status === 'nouveau'"
                    class="btn btn--primary btn--sm"
                    @click="onApproveItem(item.id)"
                  >
                    {{ t("dashboard.approve") }}
                  </button>
                  <button
                    v-if="item.status === 'nouveau'"
                    class="btn btn--outline btn--sm"
                    @click="onRejectItem(item.id)"
                  >
                    {{ t("dashboard.reject") }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="empty">{{ t("myRequests.empty") }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAuth } from "@/composables/useAuth";
import api from "@/services/api";
import * as adminService from "@/services/adminService";
import type { ClientSummary } from "@/types/api";

const { t } = useI18n();
const { user } = useAuth();

const pendingClients = ref<ClientSummary[]>([]);

interface TabColumn {
  key: string;
  label: string;
  format?: (v: any) => string;
}
interface TabDef {
  key: string;
  label: string;
  endpoint: string;
  columns: TabColumn[];
  approvable?: "personal-loan" | "professional-loan" | "account-request";
}

const currency = (v: number) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v) + " €";

const tabs: TabDef[] = [
  {
    key: "personal-loans",
    label: "Prêts personnels",
    endpoint: "/loans/personal",
    columns: [
      { key: "fullName", label: "Nom" },
      { key: "loanAmount", label: "Montant", format: currency },
      { key: "loanDurationMonths", label: "Durée (mois)" },
    ],
    approvable: "personal-loan",
  },
  {
    key: "professional-loans",
    label: "Prêts professionnels",
    endpoint: "/loans/professional",
    columns: [
      { key: "companyName", label: "Entreprise" },
      { key: "loanAmount", label: "Montant", format: currency },
      { key: "loanDurationMonths", label: "Durée (mois)" },
    ],
    approvable: "professional-loan",
  },
  {
    key: "account-requests",
    label: "Demandes de compte",
    endpoint: "/accounts",
    columns: [
      { key: "fullName", label: "Nom" },
      { key: "productType", label: "Produit" },
    ],
    approvable: "account-request",
  },
  {
    key: "cards",
    label: "Cartes bancaires",
    endpoint: "/cards",
    columns: [
      { key: "fullName", label: "Nom" },
      { key: "cardType", label: "Type" },
    ],
  },
  {
    key: "investments",
    label: "Investissements",
    endpoint: "/investments/accounts",
    columns: [
      { key: "fullName", label: "Nom" },
      { key: "riskProfile", label: "Profil" },
    ],
  },
  {
    key: "webinars",
    label: "Webinaires",
    endpoint: "/investments/webinars",
    columns: [
      { key: "fullName", label: "Nom" },
      { key: "webinarDate", label: "Date" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    endpoint: "/contact",
    columns: [
      { key: "fullName", label: "Nom" },
      { key: "subject", label: "Sujet" },
    ],
  },
];

const activeTab = ref(tabs[0].key);
const currentTab = computed(() => tabs.find((tItem) => tItem.key === activeTab.value)!);
const currentItems = ref<any[]>([]);
const loadingTab = ref(false);

async function loadTab() {
  loadingTab.value = true;
  try {
    const { data } = await api.get(currentTab.value.endpoint);
    currentItems.value = data;
  } catch {
    currentItems.value = [];
  } finally {
    loadingTab.value = false;
  }
}

async function onApproveItem(id: string) {
  const kind = currentTab.value.approvable;
  if (kind === "personal-loan") await adminService.approvePersonalLoan(id);
  else if (kind === "professional-loan") await adminService.approveProfessionalLoan(id);
  else if (kind === "account-request") await adminService.approveAccountRequest(id);
  await loadTab();
}

async function onRejectItem(id: string) {
  const kind = currentTab.value.approvable;
  if (kind === "personal-loan") await adminService.rejectPersonalLoan(id);
  else if (kind === "professional-loan") await adminService.rejectProfessionalLoan(id);
  else if (kind === "account-request") await adminService.rejectAccountRequest(id);
  await loadTab();
}

async function onApproveClient(id: string) {
  await adminService.approveClient(id);
  pendingClients.value = pendingClients.value.filter((c) => c.id !== id);
}

async function onRejectClient(id: string) {
  await adminService.rejectClient(id);
  pendingClients.value = pendingClients.value.filter((c) => c.id !== id);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

watch(activeTab, loadTab);

onMounted(async () => {
  pendingClients.value = await adminService.listClients("en_attente");
  await loadTab();
});
</script>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.25rem 0;
}

.tab-button {
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.tab-button--active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.table-wrap {
  overflow-x: auto;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn--sm {
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
}

.empty {
  color: var(--color-text-muted);
}
</style>

<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("common.brand") }}</p>
      <h1>{{ t("dashboard.clientTitle") }}</h1>
      <p class="hero__subtitle">{{ t("dashboard.welcome") }}, {{ user?.fullName }}.</p>

      <h2 style="margin-top: 2.5rem">{{ t("dashboard.accountsTitle") }}</h2>
      <p v-if="accounts.length === 0" class="hero__subtitle">{{ t("dashboard.noAccounts") }}</p>

      <div class="grid grid--3" v-else>
        <div class="card account-card" v-for="account in accounts" :key="account.id">
          <p class="eyebrow">{{ productLabel(account.productType) }}</p>
          <h3>{{ formatCurrency(account.balance) }}</h3>
          <p class="account-meta">{{ t("dashboard.accountNumber") }} : {{ account.accountNumber }}</p>
          <p class="account-meta">{{ t("dashboard.interestRate") }} : {{ account.interestRate }} %</p>
          <p class="account-meta" v-if="account.lockEndDate">
            {{ t("dashboard.lockEndDate") }} : {{ formatDate(account.lockEndDate) }}
          </p>
        </div>
      </div>

      <div v-if="accounts.length > 0" class="card form-card" style="margin-top: 2.5rem">
        <h2>{{ t("dashboard.transferTitle") }}</h2>

        <form @submit.prevent="onSubmitTransfer">
          <div class="field">
            <label>{{ t("accounts.accountType") }}</label>
            <select v-model="transferForm.bankAccountId" required>
              <option v-for="account in accounts" :key="account.id" :value="account.id">
                {{ account.accountNumber }} — {{ formatCurrency(account.balance) }}
              </option>
            </select>
          </div>
          <div class="field">
            <label>{{ t("dashboard.transferAmount") }}</label>
            <input v-model.number="transferForm.amount" type="number" min="1" required />
          </div>
          <div class="field">
            <label>{{ t("dashboard.transferBank") }}</label>
            <input v-model="transferForm.beneficiaryBankName" type="text" required />
          </div>
          <div class="field">
            <label>{{ t("dashboard.transferIban") }}</label>
            <input v-model="transferForm.beneficiaryIban" type="text" required />
          </div>

          <button class="btn btn--primary" type="submit" :disabled="transferLoading">
            {{ transferLoading ? t("common.loading") : t("dashboard.transferSubmit") }}
          </button>

          <FormAlert :message="transferSuccess" type="success" />
          <FormAlert :message="transferError" type="error" />
        </form>
      </div>

      <div class="card" style="margin-top: 2.5rem" v-if="transfers.length > 0">
        <h2>{{ t("dashboard.transferHistory") }}</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ t("dashboard.transferAmount") }}</th>
                <th>{{ t("dashboard.transferBank") }}</th>
                <th>{{ t("myRequests.status") }}</th>
                <th>{{ t("myRequests.date") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transfer in transfers" :key="transfer.id">
                <td>{{ formatCurrency(transfer.amount) }}</td>
                <td>{{ transfer.beneficiaryBankName }}</td>
                <td>{{ transfer.status }}</td>
                <td>{{ formatDate(transfer.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import FormAlert from "@/components/FormAlert.vue";
import { useAuth } from "@/composables/useAuth";
import {
  getMyBankAccounts,
  createTransferRequest,
  getMyTransferRequests,
} from "@/services/bankServices";
import type { BankAccount, TransferRequestItem } from "@/types/api";

const { t } = useI18n();
const { user } = useAuth();

const accounts = ref<BankAccount[]>([]);
const transfers = ref<TransferRequestItem[]>([]);

const transferForm = reactive({
  bankAccountId: "",
  amount: 0,
  beneficiaryBankName: "",
  beneficiaryIban: "",
});
const transferLoading = ref(false);
const transferSuccess = ref("");
const transferError = ref("");

function productLabel(type: string) {
  if (type === "epargne_bloquee") return t("accounts.resultCapital") + " · " + t("cards.typePremium");
  if (type === "epargne_libre") return "Épargne libre";
  return "Compte courant";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) + " €";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

async function loadData() {
  accounts.value = await getMyBankAccounts();
  transfers.value = await getMyTransferRequests();
  if (accounts.value.length > 0) {
    transferForm.bankAccountId = accounts.value[0].id;
  }
}

async function onSubmitTransfer() {
  transferLoading.value = true;
  transferSuccess.value = "";
  transferError.value = "";
  try {
    await createTransferRequest(transferForm);
    transferSuccess.value = t("dashboard.transferConfirmation");
    transferForm.amount = 0;
    transferForm.beneficiaryBankName = "";
    transferForm.beneficiaryIban = "";
    transfers.value = await getMyTransferRequests();
  } catch (err: any) {
    transferError.value = err?.response?.data?.message || t("common.error");
  } finally {
    transferLoading.value = false;
  }
}

onMounted(loadData);
</script>

<style scoped>
.account-card h3 {
  margin: 0.25rem 0 0.75rem;
  color: var(--color-primary);
}

.account-meta {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin: 0.15rem 0;
}

.table-wrap {
  overflow-x: auto;
}
</style>

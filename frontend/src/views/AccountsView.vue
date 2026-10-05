<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.accounts") }}</p>
      <h1>{{ t("accounts.title") }}</h1>
      <p class="hero__subtitle">{{ t("accounts.intro") }}</p>

      <div class="grid grid--2" style="margin-top: 2rem">
        <div class="card">
          <ul>
            <li>{{ t("accounts.feature1") }}</li>
            <li>{{ t("accounts.feature2") }}</li>
            <li>{{ t("accounts.feature3") }}</li>
            <li>{{ t("accounts.feature4") }}</li>
          </ul>
          <h3 style="margin-top: 1.5rem">{{ t("accounts.blockedTitle") }}</h3>
          <p>{{ t("accounts.blockedText") }}</p>
          <table class="rate-grid" v-if="rateGrid">
            <thead>
              <tr>
                <th>{{ t("accounts.durationYears") }}</th>
                <th>{{ t("accounts.interestRate") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tier in rateGrid.blockedSavingsTiers" :key="tier.minMonths">
                <td>
                  {{ tier.minMonths }}
                  {{ tier.maxMonths ? `– ${tier.maxMonths}` : "+" }}
                  {{ t("common.months") }}
                </td>
                <td>{{ tier.rate }} %</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card form-card">
          <h2>{{ t("accounts.openAccountTitle") }}</h2>
          <p class="hero__subtitle">{{ t("accounts.openAccountText") }}</p>

          <form @submit.prevent="onSubmitAccount">
            <div class="field">
              <label>{{ t("accounts.fullName") }}</label>
              <input v-model="accountForm.fullName" type="text" required />
            </div>
            <div class="field">
              <label>{{ t("accounts.email") }}</label>
              <input v-model="accountForm.email" type="email" required />
            </div>
            <div class="field">
              <label>{{ t("accounts.phone") }}</label>
              <input v-model="accountForm.phone" type="tel" required />
            </div>
            <div class="field">
              <label>{{ t("accounts.accountType") }}</label>
              <select v-model="accountForm.accountType" required>
                <option value="particulier">{{ t("accounts.accountPersonal") }}</option>
                <option value="professionnel">{{ t("accounts.accountProfessional") }}</option>
              </select>
            </div>
            <div class="field">
              <label>{{ t("accounts.productType") }}</label>
              <select v-model="accountForm.productType" required>
                <option value="courant">{{ t("accounts.productCourant") }}</option>
                <option value="epargne_libre">{{ t("accounts.productEpargneLibre") }}</option>
                <option value="epargne_bloquee">{{ t("accounts.productEpargneBloquee") }}</option>
              </select>
            </div>
            <div class="field" v-if="accountForm.productType === 'epargne_bloquee'">
              <label>{{ t("accounts.lockDuration") }}</label>
              <input v-model.number="accountForm.lockDurationMonths" type="number" min="1" max="120" required />
              <small class="field-hint" v-if="indicativeRate !== null">
                {{ t("accounts.indicativeRate", { rate: indicativeRate }) }}
              </small>
            </div>

            <button class="btn btn--primary" type="submit" :disabled="accountLoading">
              {{ accountLoading ? t("common.loading") : t("accounts.submitButton") }}
            </button>

            <FormAlert :message="accountSuccess" type="success" />
            <FormAlert :message="accountError" type="error" />
          </form>
        </div>
      </div>

      <MyRequestsList
        :endpoint="'/accounts'"
        :title="t('nav.accounts')"
        :columns="[
          { key: 'fullName', label: t('accounts.fullName') },
          { key: 'productType', label: t('accounts.productType') },
        ]"
      />

      <div class="card form-card" style="margin-top: 2.5rem">
        <h2>{{ t("accounts.savingsTitle") }}</h2>
        <p class="hero__subtitle">{{ t("accounts.savingsText") }}</p>

        <form @submit.prevent="onSimulateSavings" class="savings-form">
          <div class="field">
            <label>{{ t("accounts.monthlyAmount") }}</label>
            <input v-model.number="savingsForm.monthlyAmount" type="number" min="1" required />
          </div>
          <div class="field">
            <label>{{ t("accounts.durationMonths") }}</label>
            <input v-model.number="savingsForm.durationMonths" type="number" min="1" max="360" required />
          </div>
          <div class="field">
            <label>{{ t("accounts.interestRate") }}</label>
            <input v-model.number="savingsForm.interestRate" type="number" step="0.1" min="0" />
          </div>
          <button class="btn btn--accent" type="submit" :disabled="savingsLoading">
            {{ savingsLoading ? t("common.loading") : t("accounts.calculate") }}
          </button>
        </form>

        <div v-if="savingsResult" class="grid grid--3" style="margin-top: 1.5rem">
          <div class="card">
            <p class="eyebrow">{{ t("accounts.resultDeposited") }}</p>
            <h3>{{ formatCurrency(savingsResult.totalDeposited) }}</h3>
          </div>
          <div class="card">
            <p class="eyebrow">{{ t("accounts.resultInterest") }}</p>
            <h3>{{ formatCurrency(savingsResult.totalInterest) }}</h3>
          </div>
          <div class="card">
            <p class="eyebrow">{{ t("accounts.resultCapital") }}</p>
            <h3>{{ formatCurrency(savingsResult.finalCapital) }}</h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import FormAlert from "@/components/FormAlert.vue";
import MyRequestsList from "@/components/MyRequestsList.vue";
import { submitAccountRequest, simulateSavings } from "@/services/domainServices";
import api from "@/services/api";
import type { AccountRequestForm, SavingsSimulationResponse } from "@/types/api";

const { t } = useI18n();

const accountForm = reactive<AccountRequestForm>({
  fullName: "",
  email: "",
  phone: "",
  accountType: "particulier",
  productType: "courant",
  lockDurationMonths: 12,
});
const accountLoading = ref(false);
const accountSuccess = ref("");
const accountError = ref("");

interface RateTier {
  minMonths: number;
  maxMonths: number | null;
  rate: number;
}
const rateGrid = ref<{ freeSavingsRate: number; blockedSavingsTiers: RateTier[] } | null>(null);

const indicativeRate = computed(() => {
  if (!rateGrid.value || accountForm.productType !== "epargne_bloquee") return null;
  const months = accountForm.lockDurationMonths ?? 0;
  const tier = [...rateGrid.value.blockedSavingsTiers]
    .reverse()
    .find((t2) => months >= t2.minMonths);
  return tier ? tier.rate : null;
});

async function onSubmitAccount() {
  accountLoading.value = true;
  accountSuccess.value = "";
  accountError.value = "";
  try {
    await submitAccountRequest(accountForm);
    accountSuccess.value = t("accounts.confirmation");
  } catch (err) {
    accountError.value = t("common.error");
  } finally {
    accountLoading.value = false;
  }
}

const savingsForm = reactive({
  monthlyAmount: 100,
  durationMonths: 60,
  interestRate: 2.5,
});
const savingsResult = ref<SavingsSimulationResponse | null>(null);
const savingsLoading = ref(false);

async function onSimulateSavings() {
  savingsLoading.value = true;
  try {
    savingsResult.value = await simulateSavings(savingsForm);
  } finally {
    savingsLoading.value = false;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) + " €";
}

onMounted(async () => {
  try {
    const { data } = await api.get("/accounts/interest-rates");
    rateGrid.value = data;
  } catch {
    rateGrid.value = null;
  }
});
</script>

<style scoped>
.savings-form {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 1rem;
  align-items: end;
}

.rate-grid {
  margin-top: 1rem;
}

.field-hint {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

@media (max-width: 900px) {
  .savings-form {
    grid-template-columns: 1fr;
  }
}
</style>

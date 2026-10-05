<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.professionalLoan") }}</p>
      <h1>{{ t("professionalLoan.title") }}</h1>
      <p class="hero__subtitle">{{ t("professionalLoan.subtitle") }}</p>

      <div class="grid grid--3" style="margin: 2rem 0">
        <div class="card">
          <h3>{{ t("professionalLoan.whyTitle") }}</h3>
          <ul>
            <li>{{ t("professionalLoan.why1") }}</li>
            <li>{{ t("professionalLoan.why2") }}</li>
            <li>{{ t("professionalLoan.why3") }}</li>
          </ul>
        </div>
        <div class="card">
          <h3>{{ t("professionalLoan.offersTitle") }}</h3>
          <ul>
            <li>{{ t("professionalLoan.offer1") }}</li>
            <li>{{ t("professionalLoan.offer2") }}</li>
            <li>{{ t("professionalLoan.offer3") }}</li>
            <li>{{ t("professionalLoan.offer4") }}</li>
          </ul>
        </div>
        <div class="card">
          <h3>{{ t("professionalLoan.howTitle") }}</h3>
          <ol>
            <li>{{ t("professionalLoan.how1") }}</li>
            <li>{{ t("professionalLoan.how2") }}</li>
            <li>{{ t("professionalLoan.how3") }}</li>
          </ol>
        </div>
      </div>

      <div class="card form-card">
        <h2>{{ t("professionalLoan.formTitle") }}</h2>

        <form @submit.prevent="onSubmit">
          <div class="grid grid--2">
            <div class="field">
              <label>{{ t("personalLoan.civility") }}</label>
              <select v-model="form.civility" required>
                <option value="monsieur">{{ t("personalLoan.civilityMr") }}</option>
                <option value="madame">{{ t("personalLoan.civilityMrs") }}</option>
                <option value="autre">{{ t("personalLoan.civilityOther") }}</option>
              </select>
            </div>
            <div class="field">
              <label>{{ t("personalLoan.fullName") }}</label>
              <input v-model="form.fullName" type="text" required />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.email") }}</label>
              <input v-model="form.email" type="email" required />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.phone") }}</label>
              <input v-model="form.phone" type="tel" required />
            </div>
            <div class="field">
              <label>{{ t("professionalLoan.companyName") }}</label>
              <input v-model="form.companyName" type="text" required />
            </div>
            <div class="field">
              <label>{{ t("professionalLoan.registrationNumber") }}</label>
              <input v-model="form.registrationNumber" type="text" />
            </div>
            <div class="field">
              <label>{{ t("professionalLoan.sector") }}</label>
              <input v-model="form.sector" type="text" />
            </div>
            <div class="field">
              <label>{{ t("professionalLoan.loanType") }}</label>
              <select v-model="form.loanType" required>
                <option value="creation_entreprise">{{ t("professionalLoan.typeCreation") }}</option>
                <option value="investissement">{{ t("professionalLoan.typeInvestment") }}</option>
                <option value="tresorerie">{{ t("professionalLoan.typeTreasury") }}</option>
                <option value="developpement">{{ t("professionalLoan.typeDevelopment") }}</option>
              </select>
            </div>
            <div class="field">
              <label>{{ t("professionalLoan.loanAmount") }}</label>
              <input v-model.number="form.loanAmount" type="number" min="1000" required />
            </div>
            <div class="field">
              <label>{{ t("professionalLoan.loanDuration") }}</label>
              <input v-model.number="form.loanDurationMonths" type="number" min="6" required />
            </div>
          </div>

          <div class="field">
            <label>{{ t("professionalLoan.projectDescription") }}</label>
            <textarea v-model="form.projectDescription" rows="4"></textarea>
          </div>

          <div class="field checkbox-field">
            <input id="consentDataPro" v-model="form.consentDataUsage" type="checkbox" required />
            <label for="consentDataPro">{{ t("personalLoan.consentData") }}</label>
          </div>
          <div class="field checkbox-field">
            <input id="consentMarketingPro" v-model="form.consentMarketing" type="checkbox" />
            <label for="consentMarketingPro">{{ t("personalLoan.consentMarketing") }}</label>
          </div>

          <button class="btn btn--primary" type="submit" :disabled="loading">
            {{ loading ? t("common.loading") : t("professionalLoan.submitButton") }}
          </button>

          <FormAlert :message="successMessage" type="success" />
          <FormAlert :message="errorMessage" type="error" />
        </form>
      </div>

      <MyRequestsList
        :endpoint="'/loans/professional'"
        :title="t('nav.professionalLoan')"
        :columns="[
          { key: 'companyName', label: t('professionalLoan.companyName') },
          { key: 'loanAmount', label: t('professionalLoan.loanAmount'), format: formatCurrency },
          { key: 'loanDurationMonths', label: t('professionalLoan.loanDuration') },
        ]"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import FormAlert from "@/components/FormAlert.vue";
import MyRequestsList from "@/components/MyRequestsList.vue";
import { submitProfessionalLoan } from "@/services/loanService";
import type { ProfessionalLoanForm } from "@/types/api";

const { t } = useI18n();

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) + " €";
}

const form = reactive<ProfessionalLoanForm>({
  civility: "monsieur",
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  registrationNumber: "",
  sector: "",
  loanType: "creation_entreprise",
  loanAmount: 20000,
  loanDurationMonths: 48,
  projectDescription: "",
  consentDataUsage: false,
  consentMarketing: false,
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function onSubmit() {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";
  try {
    await submitProfessionalLoan(form);
    successMessage.value = t("professionalLoan.confirmation");
  } catch (err) {
    errorMessage.value = t("common.error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.form-card {
  max-width: 900px;
}
</style>

<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.personalLoan") }}</p>
      <h1>{{ t("personalLoan.title") }}</h1>
      <p class="hero__subtitle">{{ t("personalLoan.subtitle") }}</p>

      <div class="grid grid--3" style="margin: 2rem 0">
        <div class="card">
          <h3>{{ t("personalLoan.whyTitle") }}</h3>
          <ul>
            <li>{{ t("personalLoan.why1") }}</li>
            <li>{{ t("personalLoan.why2") }}</li>
            <li>{{ t("personalLoan.why3") }}</li>
          </ul>
        </div>
        <div class="card">
          <h3>{{ t("personalLoan.offersTitle") }}</h3>
          <ul>
            <li>{{ t("personalLoan.offer1") }}</li>
            <li>{{ t("personalLoan.offer2") }}</li>
            <li>{{ t("personalLoan.offer3") }}</li>
            <li>{{ t("personalLoan.offer4") }}</li>
          </ul>
        </div>
        <div class="card">
          <h3>{{ t("personalLoan.howTitle") }}</h3>
          <ol>
            <li>{{ t("personalLoan.how1") }}</li>
            <li>{{ t("personalLoan.how2") }}</li>
            <li>{{ t("personalLoan.how3") }}</li>
          </ol>
        </div>
      </div>

      <div class="card form-card">
        <h2>{{ t("personalLoan.formTitle") }}</h2>
        <p class="hero__subtitle">{{ t("personalLoan.formSubtitle") }}</p>

        <form @submit.prevent="onSubmit">
          <h3>{{ t("personalLoan.section1") }}</h3>
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
              <label>{{ t("personalLoan.birthDate") }}</label>
              <input v-model="form.birthDate" type="date" required />
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
              <label>{{ t("personalLoan.country") }}</label>
              <select v-model="form.country" required>
                <option value="" disabled>{{ t("common.select") }}</option>
                <option v-for="country in countries" :key="country" :disabled="country === '---'" :value="country">
                  {{ country }}
                </option>
              </select>
            </div>
            <div class="field">
              <label>{{ t("personalLoan.street") }}</label>
              <input v-model="form.street" type="text" required />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.postalCode") }}</label>
              <input v-model="form.postalCode" type="text" required />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.city") }}</label>
              <input v-model="form.city" type="text" required />
            </div>
          </div>

          <h3>{{ t("personalLoan.section2") }}</h3>
          <div class="grid grid--2">
            <div class="field">
              <label>{{ t("personalLoan.employmentStatus") }}</label>
              <select v-model="form.employmentStatus" required>
                <option value="salarie">{{ t("personalLoan.statusEmployed") }}</option>
                <option value="independant">{{ t("personalLoan.statusSelfEmployed") }}</option>
                <option value="retraite">{{ t("personalLoan.statusRetired") }}</option>
                <option value="autre">{{ t("personalLoan.statusOther") }}</option>
              </select>
            </div>
            <div class="field">
              <label>{{ t("personalLoan.employer") }}</label>
              <input v-model="form.employer" type="text" />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.monthlyIncome") }}</label>
              <input v-model.number="form.monthlyIncome" type="number" min="0" required />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.seniority") }}</label>
              <input v-model="form.seniority" type="text" placeholder="ex : 3 ans" />
            </div>
          </div>

          <h3>{{ t("personalLoan.section3") }}</h3>
          <div class="grid grid--2">
            <div class="field">
              <label>{{ t("personalLoan.loanAmount") }}</label>
              <input v-model.number="form.loanAmount" type="number" min="1000" required />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.loanDuration") }}</label>
              <input v-model.number="form.loanDurationMonths" type="number" min="6" required />
            </div>
            <div class="field">
              <label>{{ t("personalLoan.loanPurpose") }}</label>
              <select v-model="form.loanPurpose" required>
                <option value="voiture">{{ t("personalLoan.purposeCar") }}</option>
                <option value="travaux">{{ t("personalLoan.purposeWorks") }}</option>
                <option value="projet_professionnel">{{ t("personalLoan.purposeProfessional") }}</option>
                <option value="etudes">{{ t("personalLoan.purposeStudies") }}</option>
                <option value="voyages">{{ t("personalLoan.purposeTravel") }}</option>
                <option value="mariage">{{ t("personalLoan.purposeWedding") }}</option>
                <option value="autre">{{ t("personalLoan.purposeOther") }}</option>
              </select>
            </div>
            <div class="field" v-if="form.loanPurpose === 'autre'">
              <label>{{ t("personalLoan.purposeOther") }}</label>
              <input v-model="form.loanPurposeOther" type="text" />
            </div>
          </div>

          <h3>{{ t("personalLoan.section5") }}</h3>
          <div class="field checkbox-field">
            <input id="consentData" v-model="form.consentDataUsage" type="checkbox" required />
            <label for="consentData">{{ t("personalLoan.consentData") }}</label>
          </div>
          <div class="field checkbox-field">
            <input id="consentMarketing" v-model="form.consentMarketing" type="checkbox" />
            <label for="consentMarketing">{{ t("personalLoan.consentMarketing") }}</label>
          </div>

          <button class="btn btn--primary" type="submit" :disabled="loading">
            {{ loading ? t("common.loading") : t("personalLoan.submitButton") }}
          </button>

          <FormAlert :message="successMessage" type="success" />
          <FormAlert :message="errorMessage" type="error" />
        </form>
      </div>

      <MyRequestsList
        :endpoint="'/loans/personal'"
        :title="t('nav.personalLoan')"
        :columns="[
          { key: 'fullName', label: t('personalLoan.fullName') },
          { key: 'loanAmount', label: t('personalLoan.loanAmount'), format: formatCurrency },
          { key: 'loanDurationMonths', label: t('personalLoan.loanDuration') },
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
import { submitPersonalLoan } from "@/services/loanService";
import type { PersonalLoanForm } from "@/types/api";
import { COUNTRIES } from "@/data/countries";

const { t } = useI18n();
const countries = COUNTRIES;

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) + " €";
}

const form = reactive<PersonalLoanForm>({
  civility: "monsieur",
  fullName: "",
  birthDate: "",
  email: "",
  phone: "",
  street: "",
  postalCode: "",
  city: "",
  country: "",
  employmentStatus: "salarie",
  employer: "",
  monthlyIncome: 0,
  seniority: "",
  loanAmount: 10000,
  loanDurationMonths: 36,
  loanPurpose: "voiture",
  loanPurposeOther: "",
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
    await submitPersonalLoan(form);
    successMessage.value = t("personalLoan.confirmation");
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

.form-card h3 {
  margin-top: 2rem;
  color: var(--color-primary);
}

.form-card h3:first-of-type {
  margin-top: 0;
}
</style>

<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.investments") }}</p>
      <h1>{{ t("investments.title") }}</h1>
      <p class="hero__subtitle">{{ t("investments.intro") }}</p>
      <p class="hero__subtitle">{{ t("investments.expertText") }}</p>
      <p class="hero__subtitle">{{ t("investments.marketText") }}</p>

      <div class="grid grid--2" style="margin-top: 2rem">
        <div class="card">
          <ul>
            <li>{{ t("investments.feature1") }}</li>
            <li>{{ t("investments.feature2") }}</li>
            <li>{{ t("investments.feature3") }}</li>
            <li>{{ t("investments.feature4") }}</li>
          </ul>
        </div>

        <div class="card form-card">
          <h2>{{ t("investments.accountFormTitle") }}</h2>
          <p class="hero__subtitle">{{ t("investments.accountFormText") }}</p>

          <form @submit.prevent="onSubmitAccount">
            <div class="field">
              <label>{{ t("investments.fullName") }}</label>
              <input v-model="accountForm.fullName" type="text" required />
            </div>
            <div class="field">
              <label>{{ t("investments.email") }}</label>
              <input v-model="accountForm.email" type="email" required />
            </div>
            <div class="field">
              <label>{{ t("investments.phone") }}</label>
              <input v-model="accountForm.phone" type="tel" required />
            </div>
            <div class="field">
              <label>{{ t("investments.riskProfile") }}</label>
              <select v-model="accountForm.riskProfile" required>
                <option value="faible">{{ t("investments.riskLow") }}</option>
                <option value="modere">{{ t("investments.riskMedium") }}</option>
                <option value="eleve">{{ t("investments.riskHigh") }}</option>
              </select>
            </div>
            <div class="field">
              <label>{{ t("investments.investmentGoal") }}</label>
              <select v-model="accountForm.investmentGoal" required>
                <option value="court_terme">{{ t("investments.goalShort") }}</option>
                <option value="moyen_terme">{{ t("investments.goalMedium") }}</option>
                <option value="long_terme">{{ t("investments.goalLong") }}</option>
              </select>
            </div>

            <button class="btn btn--primary" type="submit" :disabled="accountLoading">
              {{ accountLoading ? t("common.loading") : t("investments.openAccountButton") }}
            </button>

            <FormAlert :message="accountSuccess" type="success" />
            <FormAlert :message="accountError" type="error" />
          </form>
        </div>
      </div>

      <MyRequestsList
        :endpoint="'/investments/accounts'"
        :title="t('nav.investments')"
        :columns="[
          { key: 'fullName', label: t('investments.fullName') },
          { key: 'riskProfile', label: t('investments.riskProfile') },
        ]"
      />

      <div class="card form-card" style="margin-top: 2.5rem">
        <h2>{{ t("investments.webinarTitle") }}</h2>
        <p class="hero__subtitle">{{ t("investments.webinarText") }}</p>

        <form @submit.prevent="onRegisterWebinar" class="webinar-form">
          <div class="field">
            <label>{{ t("investments.fullName") }}</label>
            <input v-model="webinarForm.fullName" type="text" required />
          </div>
          <div class="field">
            <label>{{ t("investments.email") }}</label>
            <input v-model="webinarForm.email" type="email" required />
          </div>
          <div class="field">
            <label>{{ t("investments.webinarDate") }}</label>
            <input v-model="webinarForm.webinarDate" type="date" required />
          </div>
          <button class="btn btn--accent" type="submit" :disabled="webinarLoading">
            {{ webinarLoading ? t("common.loading") : t("investments.registerButton") }}
          </button>
        </form>

        <FormAlert :message="webinarSuccess" type="success" />
        <FormAlert :message="webinarError" type="error" />
      </div>

      <MyRequestsList
        :endpoint="'/investments/webinars'"
        :title="t('investments.webinarTitle')"
        :columns="[
          { key: 'fullName', label: t('investments.fullName') },
          { key: 'webinarDate', label: t('investments.webinarDate') },
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
import { submitInvestmentAccount, registerWebinar } from "@/services/domainServices";
import type { InvestmentAccountForm, WebinarRegistrationForm } from "@/types/api";

const { t } = useI18n();

const accountForm = reactive<InvestmentAccountForm>({
  fullName: "",
  email: "",
  phone: "",
  riskProfile: "modere",
  investmentGoal: "moyen_terme",
});
const accountLoading = ref(false);
const accountSuccess = ref("");
const accountError = ref("");

async function onSubmitAccount() {
  accountLoading.value = true;
  accountSuccess.value = "";
  accountError.value = "";
  try {
    await submitInvestmentAccount(accountForm);
    accountSuccess.value = t("investments.accountConfirmation");
  } catch (err) {
    accountError.value = t("common.error");
  } finally {
    accountLoading.value = false;
  }
}

const webinarForm = reactive<WebinarRegistrationForm>({
  fullName: "",
  email: "",
  webinarDate: "",
});
const webinarLoading = ref(false);
const webinarSuccess = ref("");
const webinarError = ref("");

async function onRegisterWebinar() {
  webinarLoading.value = true;
  webinarSuccess.value = "";
  webinarError.value = "";
  try {
    await registerWebinar(webinarForm);
    webinarSuccess.value = t("investments.webinarConfirmation");
  } catch (err) {
    webinarError.value = t("common.error");
  } finally {
    webinarLoading.value = false;
  }
}
</script>

<style scoped>
.webinar-form {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 1rem;
  align-items: end;
}

@media (max-width: 900px) {
  .webinar-form {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.cards") }}</p>
      <h1>{{ t("cards.title") }}</h1>
      <p class="hero__subtitle">{{ t("cards.intro") }}</p>

      <div class="grid grid--2" style="margin: 2rem 0">
        <div class="card">
          <ul>
            <li>{{ t("cards.feature1") }}</li>
            <li>{{ t("cards.feature2") }}</li>
            <li>{{ t("cards.feature3") }}</li>
            <li>{{ t("cards.feature4") }}</li>
          </ul>
          <p>{{ t("cards.manageApp") }}</p>
        </div>

        <div class="card form-card">
          <h2>{{ t("cards.formTitle") }}</h2>
          <p class="hero__subtitle">{{ t("cards.formSubtitle") }}</p>

          <form @submit.prevent="onSubmit">
            <div class="field">
              <label>{{ t("cards.cardType") }}</label>
              <select v-model="form.cardType" required>
                <option value="classique">{{ t("cards.typeClassic") }}</option>
                <option value="gold">{{ t("cards.typeGold") }}</option>
                <option value="premium">{{ t("cards.typePremium") }}</option>
              </select>
            </div>
            <div class="field">
              <label>{{ t("cards.fullName") }}</label>
              <input v-model="form.fullName" type="text" required />
            </div>
            <div class="field">
              <label>{{ t("cards.email") }}</label>
              <input v-model="form.email" type="email" required />
            </div>
            <div class="field">
              <label>{{ t("cards.phone") }}</label>
              <input v-model="form.phone" type="tel" required />
            </div>

            <button class="btn btn--primary" type="submit" :disabled="loading">
              {{ loading ? t("common.loading") : t("cards.submitButton") }}
            </button>

            <FormAlert :message="successMessage" type="success" />
            <FormAlert :message="errorMessage" type="error" />
          </form>
        </div>
      </div>

      <MyRequestsList
        :endpoint="'/cards'"
        :title="t('nav.cards')"
        :columns="[
          { key: 'fullName', label: t('cards.fullName') },
          { key: 'cardType', label: t('cards.cardType') },
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
import { submitCardRequest } from "@/services/domainServices";
import type { CardRequestForm } from "@/types/api";

const { t } = useI18n();

const form = reactive<CardRequestForm>({
  cardType: "classique",
  fullName: "",
  email: "",
  phone: "",
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function onSubmit() {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";
  try {
    await submitCardRequest(form);
    successMessage.value = t("cards.confirmation");
  } catch (err) {
    errorMessage.value = t("common.error");
  } finally {
    loading.value = false;
  }
}
</script>

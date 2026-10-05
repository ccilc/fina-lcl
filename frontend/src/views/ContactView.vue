<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.contact") }}</p>
      <h1>{{ t("contact.title") }}</h1>
      <p class="hero__subtitle">{{ t("contact.subtitle") }}</p>

      <div class="card form-card" style="max-width: 640px; margin-top: 2rem">
        <form @submit.prevent="onSubmit">
          <div class="field">
            <label>{{ t("contact.fullName") }}</label>
            <input v-model="form.fullName" type="text" required />
          </div>
          <div class="field">
            <label>{{ t("contact.email") }}</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="field">
            <label>{{ t("contact.phone") }}</label>
            <input v-model="form.phone" type="tel" />
          </div>
          <div class="field">
            <label>{{ t("contact.subject") }}</label>
            <input v-model="form.subject" type="text" />
          </div>
          <div class="field">
            <label>{{ t("contact.message") }}</label>
            <textarea v-model="form.message" rows="5" required></textarea>
          </div>

          <button class="btn btn--primary" type="submit" :disabled="loading">
            {{ loading ? t("common.loading") : t("contact.submitButton") }}
          </button>

          <FormAlert :message="successMessage" type="success" />
          <FormAlert :message="errorMessage" type="error" />
        </form>
      </div>

      <MyRequestsList
        :endpoint="'/contact'"
        :title="t('nav.contact')"
        :columns="[
          { key: 'subject', label: t('contact.subject') },
          { key: 'message', label: t('contact.message') },
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
import { submitContactMessage } from "@/services/domainServices";
import type { ContactForm } from "@/types/api";

const { t } = useI18n();

const form = reactive<ContactForm>({
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

async function onSubmit() {
  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";
  try {
    await submitContactMessage(form);
    successMessage.value = t("contact.confirmation");
    form.fullName = "";
    form.email = "";
    form.phone = "";
    form.subject = "";
    form.message = "";
  } catch (err) {
    errorMessage.value = t("common.error");
  } finally {
    loading.value = false;
  }
}
</script>

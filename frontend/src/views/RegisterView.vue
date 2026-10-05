<template>
  <section class="section">
    <div class="container">
      <div class="card auth-card">
        <p class="eyebrow">{{ t("common.brand") }}</p>
        <h1>{{ t("auth.registerTitle") }}</h1>
        <p class="hero__subtitle">{{ t("auth.registerSubtitle") }}</p>

        <form v-if="!success" @submit.prevent="onSubmit">
          <div class="field">
            <label>{{ t("auth.fullName") }}</label>
            <input v-model="form.fullName" type="text" required />
          </div>
          <div class="field">
            <label>{{ t("auth.email") }}</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="field">
            <label>{{ t("auth.phone") }}</label>
            <input v-model="form.phone" type="tel" />
          </div>
          <div class="field">
            <label>{{ t("auth.password") }}</label>
            <input v-model="form.password" type="password" minlength="8" required />
          </div>

          <button class="btn btn--primary" type="submit" :disabled="loading">
            {{ loading ? t("common.loading") : t("auth.registerButton") }}
          </button>

          <FormAlert :message="errorMessage" type="error" />
        </form>

        <FormAlert v-else :message="t('auth.registerSuccess')" type="success" />

        <p class="switch-link">
          {{ t("auth.alreadyAccount") }}
          <router-link to="/connexion">{{ t("auth.loginLink") }}</router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import FormAlert from "@/components/FormAlert.vue";
import { useAuth } from "@/composables/useAuth";

const { t } = useI18n();
const { register } = useAuth();

const form = reactive({ fullName: "", email: "", phone: "", password: "" });
const loading = ref(false);
const errorMessage = ref("");
const success = ref(false);

async function onSubmit() {
  loading.value = true;
  errorMessage.value = "";
  try {
    await register(form);
    success.value = true;
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || t("common.error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-card {
  max-width: 460px;
  margin: 0 auto;
}

.switch-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}
</style>

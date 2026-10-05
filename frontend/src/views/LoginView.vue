<template>
  <section class="section">
    <div class="container">
      <div class="card auth-card">
        <p class="eyebrow">{{ t("common.brand") }}</p>
        <h1>{{ t("auth.loginTitle") }}</h1>
        <p class="hero__subtitle">{{ t("auth.loginSubtitle") }}</p>

        <form @submit.prevent="onSubmit">
          <div class="field">
            <label>{{ t("auth.email") }}</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="field">
            <label>{{ t("auth.password") }}</label>
            <input v-model="form.password" type="password" required />
          </div>

          <button class="btn btn--primary" type="submit" :disabled="loading">
            {{ loading ? t("common.loading") : t("auth.loginButton") }}
          </button>

          <FormAlert :message="errorMessage" type="error" />
        </form>

        <p class="switch-link">
          {{ t("auth.noAccount") }}
          <router-link to="/inscription">{{ t("auth.createAccount") }}</router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import FormAlert from "@/components/FormAlert.vue";
import { useAuth } from "@/composables/useAuth";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { login } = useAuth();

const form = reactive({ email: "", password: "" });
const loading = ref(false);
const errorMessage = ref("");

async function onSubmit() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const user = await login(form);
    const redirect = (route.query.redirect as string) || null;
    if (redirect) {
      router.push(redirect);
    } else if (user.role === "admin" || user.role === "advisor") {
      router.push("/administration");
    } else {
      router.push("/mon-espace");
    }
  } catch (err: any) {
    errorMessage.value = err?.response?.data?.message || t("auth.loginError");
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

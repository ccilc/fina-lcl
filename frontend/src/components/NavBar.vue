<template>
  <header class="navbar">
    <div class="container navbar__inner">
      <router-link to="/" class="navbar__brand">
        🌸 {{ t("common.brand") }}
      </router-link>

      <nav class="navbar__links" :class="{ 'navbar__links--open': open }">
        <router-link to="/" @click="open = false">{{ t("nav.home") }}</router-link>
        <router-link to="/simulateur" @click="open = false">{{ t("nav.simulator") }}</router-link>
        <router-link to="/prets-personnels" @click="open = false">{{ t("nav.personalLoan") }}</router-link>
        <router-link to="/prets-professionnels" @click="open = false">{{ t("nav.professionalLoan") }}</router-link>
        <router-link to="/cartes-bancaires" @click="open = false">{{ t("nav.cards") }}</router-link>
        <router-link to="/comptes-epargne" @click="open = false">{{ t("nav.accounts") }}</router-link>
        <router-link to="/investissements" @click="open = false">{{ t("nav.investments") }}</router-link>
        <router-link to="/fondation" @click="open = false">{{ t("nav.foundation") }}</router-link>
        <router-link to="/faq" @click="open = false">{{ t("nav.faq") }}</router-link>
        <router-link to="/contact" @click="open = false">{{ t("nav.contact") }}</router-link>

        <template v-if="isAuthenticated">
          <router-link v-if="isClient" to="/mon-espace" @click="open = false">
            {{ t("auth.mySpace") }}
          </router-link>
          <router-link v-if="isStaff" to="/administration" @click="open = false">
            {{ t("auth.administration") }}
          </router-link>
          <a href="#" @click.prevent="onLogout">{{ t("auth.logout") }}</a>
        </template>
        <template v-else>
          <router-link to="/connexion" @click="open = false">{{ t("auth.loginLink") }}</router-link>
          <router-link to="/inscription" @click="open = false">{{ t("auth.createAccount") }}</router-link>
        </template>
      </nav>

      <div class="navbar__actions">
        <LanguageSwitcher />
        <button class="navbar__burger" @click="open = !open" aria-label="Menu">☰</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { useAuth } from "@/composables/useAuth";

const { t } = useI18n();
const open = ref(false);
const router = useRouter();
const { isAuthenticated, isStaff, isClient, logout } = useAuth();

function onLogout() {
  logout();
  open.value = false;
  router.push("/");
}
</script>

<style scoped>
.navbar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 0.9rem;
  padding-bottom: 0.9rem;
}

.navbar__brand {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--color-primary);
}

.navbar__links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.navbar__links a {
  color: var(--color-text-muted);
  white-space: nowrap;
}

.navbar__links a.router-link-exact-active {
  color: var(--color-primary);
  font-weight: 700;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar__burger {
  display: none;
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
}

@media (max-width: 980px) {
  .navbar__links {
    display: none;
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 0.75rem;
  }

  .navbar__links--open {
    display: flex;
  }

  .navbar__inner {
    flex-wrap: wrap;
  }

  .navbar__burger {
    display: inline-block;
  }
}
</style>

<template>
  <NavBar />
  <main>
    <router-view />
  </main>
  <Footer />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import { i18n } from "@/i18n";
import { useLanguage } from "@/composables/useLanguage";

const { setLanguage } = useLanguage();

onMounted(() => {
  // Si la langue enregistrée n'est ni fr ni en, elle doit être re-traduite
  // dynamiquement (les traductions dynamiques ne sont mises en cache que
  // dans localStorage, pas dans les messages i18n qui sont réinitialisés
  // à chaque rechargement de page).
  const saved = localStorage.getItem("cfc_locale");
  if (saved && !i18n.global.availableLocales.includes(saved as any)) {
    setLanguage(saved);
  }
});
</script>

<style>
@import "@/assets/styles/main.css";
</style>

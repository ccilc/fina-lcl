<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.foundation") }}</p>
      <h1>{{ t("foundation.title") }}</h1>
      <div class="card" style="max-width: 780px; margin-top: 2rem">
        <p>{{ t("foundation.text1") }}</p>
        <p>{{ t("foundation.text2") }}</p>
        <p>{{ t("foundation.text3") }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

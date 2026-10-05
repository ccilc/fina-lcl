<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.faq") }}</p>
      <h1>{{ t("faq.title") }}</h1>
      <p class="hero__subtitle">{{ t("faq.subtitle") }}</p>

      <div class="faq-list">
        <details class="card" v-for="item in items" :key="item.id">
          <summary>{{ t(item.question) }}</summary>
          <p>{{ t(item.answer) }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import api from "@/services/api";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const { t } = useI18n();
const items = ref<FaqItem[]>([]);

onMounted(async () => {
  try {
    const { data } = await api.get<FaqItem[]>("/faq");
    items.value = data;
  } catch {
    // Repli local si l'API est indisponible : on utilise les mêmes clés i18n
    items.value = [
      { id: "documents", question: "faq.q1.question", answer: "faq.q1.answer" },
      { id: "delai", question: "faq.q2.question", answer: "faq.q2.answer" },
      { id: "taux", question: "faq.q3.question", answer: "faq.q3.answer" },
    ];
  }
});
</script>

<style scoped>
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 780px;
}

summary {
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-heading);
}

details p {
  margin-top: 0.75rem;
  color: var(--color-text-muted);
}
</style>

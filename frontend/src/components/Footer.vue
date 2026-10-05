<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div>
        <strong>{{ t("common.brand") }}</strong>
        <p>{{ t("footer.slogan") }}</p>
      </div>
      <p class="footer__rights">
        &copy; {{ year }} {{ t("common.brand") }} — {{ t("footer.rights") }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const year = new Date().getFullYear();
</script>

<style scoped>
.footer {
  background: var(--color-primary-dark);
  color: rgba(255, 255, 255, 0.85);
  margin-top: 4rem;
}

.footer__inner {
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.footer p {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
}

.footer__rights {
  font-size: 0.8rem;
}
</style>

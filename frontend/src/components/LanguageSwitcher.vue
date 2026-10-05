<template>
  <div class="lang-switcher">
    <select
      class="lang-switcher__select"
      :value="currentLocale"
      :disabled="isTranslating"
      @change="onChange"
      :aria-label="t('language.select')"
    >
      <option v-for="lang in supportedLanguages" :key="lang.code" :value="lang.code">
        {{ lang.flag }} {{ lang.label }}
      </option>
    </select>
    <span v-if="isTranslating" class="lang-switcher__spinner" :title="t('language.translating')">
      ⏳
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useLanguage } from "@/composables/useLanguage";

const { t } = useI18n();
const { currentLocale, isTranslating, setLanguage, supportedLanguages } = useLanguage();

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  setLanguage(target.value);
}
</script>

<style scoped>
.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-switcher__select {
  appearance: none;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--color-text, #1a2b3c);
  cursor: pointer;
}

.lang-switcher__select:disabled {
  opacity: 0.6;
  cursor: wait;
}

.lang-switcher__spinner {
  font-size: 0.9rem;
}
</style>

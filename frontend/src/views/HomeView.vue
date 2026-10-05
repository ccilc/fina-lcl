<template>
  <section class="hero section">
    <div class="container hero__inner">
      <div>
        <p class="eyebrow">{{ t("common.brand") }}</p>
        <h1>{{ t("home.heroTitle") }}</h1>
        <p class="hero__subtitle">{{ t("home.heroSubtitle") }}</p>
        <div class="hero__actions">
          <router-link class="btn btn--primary" to="/simulateur">
            {{ t("home.ctaSimulate") }}
          </router-link>
          <router-link class="btn btn--outline" to="/contact">
            {{ t("home.ctaContact") }}
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("common.brand") }}</p>
      <h2>{{ t("home.servicesTitle") }}</h2>
      <div class="grid grid--3" style="margin-top: 2rem">
        <router-link to="/prets-personnels" class="card service-card">
          <h3>{{ t("home.service1Title") }}</h3>
          <p>{{ t("home.service1Desc") }}</p>
        </router-link>
        <router-link to="/prets-professionnels" class="card service-card">
          <h3>{{ t("home.service2Title") }}</h3>
          <p>{{ t("home.service2Desc") }}</p>
        </router-link>
        <router-link to="/cartes-bancaires" class="card service-card">
          <h3>{{ t("home.service3Title") }}</h3>
          <p>{{ t("home.service3Desc") }}</p>
        </router-link>
        <router-link to="/comptes-epargne" class="card service-card">
          <h3>{{ t("home.service4Title") }}</h3>
          <p>{{ t("home.service4Desc") }}</p>
        </router-link>
        <router-link to="/investissements" class="card service-card">
          <h3>{{ t("home.service5Title") }}</h3>
          <p>{{ t("home.service5Desc") }}</p>
        </router-link>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="container">
      <h2>{{ t("home.whyTitle") }}</h2>
      <p class="hero__subtitle">{{ t("home.whySubtitle") }}</p>
      <div class="grid grid--3" style="margin-top: 2rem">
        <div class="card" v-for="n in 6" :key="n">
          <h3>{{ t(`home.why${n}Title`) }}</h3>
          <p>{{ t(`home.why${n}Desc`) }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section cta-band">
    <div class="container cta-band__inner">
      <div>
        <h2>{{ t("home.ctaTitle") }}</h2>
        <p>{{ t("home.ctaSubtitle") }}</p>
      </div>
      <div class="hero__actions">
        <router-link class="btn btn--accent" to="/simulateur">
          {{ t("home.ctaSimulate") }}
        </router-link>
        <router-link class="btn btn--outline" to="/contact">
          {{ t("home.ctaContact") }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: #fff;
  padding: 5rem 0;
}

.hero h1 {
  color: #fff;
  font-size: 2.4rem;
  max-width: 760px;
}

.hero__subtitle {
  color: rgba(255, 255, 255, 0.88);
  max-width: 640px;
  margin-top: 1rem;
  font-size: 1.05rem;
}

.section:not(.hero):not(.cta-band) .hero__subtitle {
  color: var(--color-text-muted);
}

.hero__actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.service-card {
  display: block;
  color: inherit;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.service-card h3 {
  color: var(--color-primary);
  margin-top: 0;
}

.cta-band {
  background: var(--color-accent);
}

.cta-band__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.cta-band h2 {
  margin: 0 0 0.5rem;
}
</style>

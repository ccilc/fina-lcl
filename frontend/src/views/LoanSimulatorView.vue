<template>
  <section class="section">
    <div class="container">
      <p class="eyebrow">{{ t("nav.simulator") }}</p>
      <h1>{{ t("simulator.title") }}</h1>
      <p class="hero__subtitle">{{ t("simulator.subtitle") }}</p>

      <div class="simulator-grid">
        <form class="card" @submit.prevent="runSimulation">
          <div class="field">
            <label>{{ t("simulator.typeLabel") }}</label>
            <select v-model="form.loanType">
              <option value="personnel">{{ t("simulator.typePersonal") }}</option>
              <option value="professionnel">{{ t("simulator.typeProfessional") }}</option>
            </select>
          </div>

          <div class="field">
            <label>{{ t("simulator.amountLabel") }}</label>
            <input
              v-model.number="form.amount"
              type="number"
              min="1000"
              step="100"
              required
            />
          </div>

          <div class="field">
            <label>{{ t("simulator.durationLabel") }}</label>
            <input
              v-model.number="form.durationMonths"
              type="number"
              min="1"
              :max="MAX_DURATION_MONTHS"
              step="1"
              required
            />
            <small class="field-hint">
              {{ t("simulator.durationHint", { max: MAX_DURATION_MONTHS }) }}
            </small>
          </div>

          <div class="field">
            <label>{{ t("simulator.incomeLabel") }}</label>
            <input v-model.number="form.monthlyIncome" type="number" min="0" />
          </div>

          <button class="btn btn--primary" type="submit" :disabled="loading">
            {{ loading ? t("common.loading") : t("simulator.cta") }}
          </button>

          <FormAlert :message="errorMessage" type="error" />
        </form>

        <div class="card result-card" v-if="result">
          <h3>{{ t("simulator.resultTitle") }}</h3>
          <dl>
            <div class="result-row">
              <dt>{{ t("simulator.monthlyPayment") }}</dt>
              <dd>{{ formatCurrency(result.monthlyPayment) }}</dd>
            </div>
            <div class="result-row">
              <dt>{{ t("simulator.interestRate") }}</dt>
              <dd>{{ result.input.interestRate }} %</dd>
            </div>
            <div class="result-row">
              <dt>{{ t("simulator.totalCost") }}</dt>
              <dd>{{ formatCurrency(result.totalCost) }}</dd>
            </div>
            <div class="result-row" v-if="result.debtRatioPercent !== null">
              <dt>{{ t("simulator.debtRatio") }}</dt>
              <dd>{{ result.debtRatioPercent }} %</dd>
            </div>
          </dl>
        </div>
      </div>

      <div v-if="result" class="schedule-block">
        <h2>{{ t("simulator.scheduleTitle") }}</h2>
        <div class="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>{{ t("simulator.scheduleMonth") }}</th>
                <th>{{ t("simulator.schedulePayment") }}</th>
                <th>{{ t("simulator.scheduleInterest") }}</th>
                <th>{{ t("simulator.schedulePrincipal") }}</th>
                <th>{{ t("simulator.scheduleRemaining") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in displayedSchedule" :key="row.month">
                <td>{{ row.month }}</td>
                <td>{{ formatCurrency(row.payment) }}</td>
                <td>{{ formatCurrency(row.interest) }}</td>
                <td>{{ formatCurrency(row.principal) }}</td>
                <td>{{ formatCurrency(row.remainingBalance) }}</td>
              </tr>
            </tbody>
          </table>
          <button
            v-if="result.schedule.length > 12"
            class="btn btn--outline"
            style="margin-top: 1rem"
            @click="showFullSchedule = !showFullSchedule"
          >
            {{ showFullSchedule ? "−" : "+" }} {{ result.schedule.length }} {{ t("common.months") }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import FormAlert from "@/components/FormAlert.vue";
import { simulateLoan } from "@/services/loanService";
import type { LoanSimulationResponse } from "@/types/api";

const { t } = useI18n();

const MAX_DURATION_MONTHS = 240;

const form = reactive({
  amount: 20000,
  durationMonths: 36,
  loanType: "personnel" as "personnel" | "professionnel",
  monthlyIncome: undefined as number | undefined,
});

const result = ref<LoanSimulationResponse | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const showFullSchedule = ref(false);

const displayedSchedule = computed(() => {
  if (!result.value) return [];
  return showFullSchedule.value ? result.value.schedule : result.value.schedule.slice(0, 12);
});

function formatCurrency(value: number | undefined) {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) + " €";
}

async function runSimulation() {
  if (form.durationMonths > MAX_DURATION_MONTHS) {
    form.durationMonths = MAX_DURATION_MONTHS;
  }
  if (form.durationMonths < 1) {
    form.durationMonths = 1;
  }

  loading.value = true;
  errorMessage.value = "";
  try {
    result.value = await simulateLoan({
      amount: form.amount,
      durationMonths: form.durationMonths,
      loanType: form.loanType,
      monthlyIncome: form.monthlyIncome,
    });
    showFullSchedule.value = false;
  } catch (err) {
    errorMessage.value = t("common.error");
  } finally {
    loading.value = false;
  }
}

runSimulation();
</script>

<style scoped>
.simulator-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.75rem;
  margin-top: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .simulator-grid {
    grid-template-columns: 1fr;
  }
}

form output {
  font-weight: 700;
  color: var(--color-primary);
}

.field-hint {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.result-card dl {
  margin: 0;
}

.result-row {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid var(--color-border);
}

.result-row dt {
  color: var(--color-text-muted);
}

.result-row dd {
  margin: 0;
  font-weight: 700;
}

.schedule-block {
  margin-top: 2.5rem;
}

.table-wrap {
  overflow-x: auto;
}
</style>

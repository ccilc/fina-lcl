<template>
  <div v-if="isAuthenticated" class="my-requests card">
    <h3>{{ title }}</h3>

    <p v-if="loading">{{ t("common.loading") }}</p>
    <p v-else-if="items.length === 0" class="empty">{{ t("myRequests.empty") }}</p>

    <div v-else class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
            <th>{{ t("myRequests.status") }}</th>
            <th>{{ t("myRequests.date") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td v-for="col in columns" :key="col.key">
              {{ col.format ? col.format(item[col.key]) : item[col.key] }}
            </td>
            <td>
              <span class="status-badge" :class="`status-badge--${item.status}`">
                {{ t(`myRequests.statusValues.${item.status}`) }}
              </span>
            </td>
            <td>{{ formatDate(item.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <p v-else class="hint-anonymous">{{ t("myRequests.loginHint") }}</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import api from "@/services/api";
import { useAuth } from "@/composables/useAuth";

export interface RequestColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

const props = defineProps<{
  endpoint: string;
  columns: RequestColumn[];
  title: string;
}>();

const { t } = useI18n();
const { isAuthenticated } = useAuth();

const items = ref<any[]>([]);
const loading = ref(false);

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

async function loadItems() {
  if (!isAuthenticated.value) return;
  loading.value = true;
  try {
    const { data } = await api.get(props.endpoint);
    items.value = data;
  } catch {
    items.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadItems);
defineExpose({ reload: loadItems });
</script>

<style scoped>
.my-requests {
  margin-top: 2.5rem;
}

.empty {
  color: var(--color-text-muted);
}

.table-wrap {
  overflow-x: auto;
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
}

.status-badge--nouveau {
  background: rgba(15, 76, 129, 0.12);
  color: var(--color-primary);
}

.status-badge--en_cours {
  background: rgba(242, 165, 65, 0.18);
  color: #a86a12;
}

.status-badge--approuve {
  background: rgba(31, 157, 85, 0.14);
  color: var(--color-success);
}

.status-badge--refuse {
  background: rgba(214, 69, 69, 0.12);
  color: var(--color-error);
}

.hint-anonymous {
  margin-top: 2rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>

<template>
  <div v-if="message" class="alert" :class="type === 'error' ? 'alert--error' : 'alert--success'">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
  type: "success" | "error";
}>();
</script>

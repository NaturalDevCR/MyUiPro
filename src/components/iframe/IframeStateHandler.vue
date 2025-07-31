<template>
  <!-- Loading state overlay -->
  <div v-if="iframeStore.isLoading" class="iframe-loading-overlay">
    <q-spinner-dots size="50px" color="primary" />
    <p class="loading-text">{{ $t('misc.connecting') }}...</p>
  </div>

  <!-- Error state overlay -->
  <div v-else-if="iframeStore.hasError" class="iframe-error-overlay">
    <q-icon name="mdi-alert-circle" size="50px" color="negative" />
    <p class="error-text">{{ iframeStore.errorMessage }}</p>
    <q-btn
      @click="iframeStore.retryConnection"
      color="primary"
      :label="$t('misc.retry')"
      icon="mdi-refresh"
    />
  </div>
</template>

<script setup lang="ts">
import { useIframeStore } from 'stores/iframe-store';

// Store
const iframeStore = useIframeStore();
</script>

<style scoped>
.iframe-loading-overlay,
.iframe-error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.iframe-error-overlay {
  color: var(--q-negative);
}

.loading-text,
.error-text {
  margin-top: 16px;
  font-size: 14px;
  opacity: 0.8;
}
</style>
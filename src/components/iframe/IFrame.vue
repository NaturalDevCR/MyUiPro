<template>
  <div
    class="resizable-iframe-container"
    :style="{ height: `calc(100vh - ${commonStore?.barSize || '40px'})` }"
  >
    <!-- State Handler (Loading/Error) -->
    <IframeStateHandler />

    <!-- Layout Handler -->
    <IframeLayout
      v-if="!iframeStore.isLoading && !iframeStore.hasError"
      :layout="layoutsStore.selectedLayout"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';
import { useLayoutsStore } from 'stores/layouts-store';
import { useMixerStore } from 'stores/mixer-store';
import { useCommonStore } from 'stores/common-store';
import { useIframeStore } from 'stores/iframe-store';
import IframeStateHandler from './IframeStateHandler.vue';
import IframeLayout from './IframeLayout.vue';

// Stores
const layoutsStore = useLayoutsStore();
const mixerStore = useMixerStore();
const commonStore = useCommonStore();
const iframeStore = useIframeStore();

// Watchers
watch(
  () => layoutsStore.selectedLayout,
  (newLayout) => {
    iframeStore.resetState();
    iframeStore.initializeSplitterPositions(newLayout);
  },
  { deep: true },
);

watch(
  () => mixerStore.ip,
  () => {
    iframeStore.resetState();
  },
);

/**
 * Expose methods for parent component control
 */
defineExpose({
  retryConnection: iframeStore.handleRetry,
  clearFrames: iframeStore.resetState,
  getLoadedFrames: () => iframeStore.loadedFrames,
  getAllIframes: () => iframeStore.iframeRefs,
});

// Lifecycle
onMounted(() => {
  iframeStore.initializeSplitterPositions(layoutsStore.selectedLayout);
});

onUnmounted(() => {
  iframeStore.resetState();
});
</script>

<style>
/* Import styles outside scoped to avoid conflicts */
@import '/src/css/_iframe.scss';
</style>

<style scoped>
.resizable-iframe-container {
  position: relative;
  width: 100%;
}

.single-frame {
  height: 100%;
  width: 100%;
}
</style>

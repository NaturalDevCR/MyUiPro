<template>
  <div class="iframe-wrapper" :data-frame-id="frameId">
    <iframe
      :key="iframeKey"
      :ref="setIframeRef"
      :id="iframeId"
      :allowfullscreen="false"
      :loading="iframeLoading"
      class="full-width full-height mixer-iframe"
      :src="src"
      :title="title"
      sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ComponentPublicInstance } from 'vue';
import { useIframeStore } from 'stores/iframe-store';
import { useMixerStore } from 'stores/mixer-store';

// Props
interface Props {
  sectionIndex: number;
  subFrameIndex?: number | null;
  src: string;
}

const props = withDefaults(defineProps<Props>(), {
  subFrameIndex: null,
});

// Stores
const iframeStore = useIframeStore();
const mixerStore = useMixerStore();

// Computed
const frameId = computed(() => {
  return props.subFrameIndex !== null
    ? `${props.sectionIndex}-${props.subFrameIndex}`
    : `${props.sectionIndex}`;
});

const iframeId = computed(() => `mixer-iframe-${frameId.value}`);

const iframeKey = computed(() => {
  return `frame-${frameId.value}-${mixerStore.ip}-${iframeStore.retryCount}`;
});

const title = computed(() => `Mixer Interface Frame ${frameId.value}`);

const iframeLoading = computed(() => {
  return mixerStore.isConnected ? 'eager' : 'lazy';
});

// Methods
/**
 * Set iframe ref handler compatible with Vue 3 VNodeRef type
 * @param ref - Element, ComponentPublicInstance or null
 */
const setIframeRef = (ref: Element | ComponentPublicInstance | null) => {
  // Type guard to ensure we have an HTMLIFrameElement
  if (ref && ref instanceof HTMLIFrameElement) {
    iframeStore.setIframeRef(ref);
  }
};

/**
 * Handle iframe load event
 * @param event - Load event
 */
const onLoad = (event: Event) => {
  const iframe = event.target as HTMLIFrameElement;
  iframeStore.onIframeLoad(frameId.value, iframe);
};

/**
 * Handle iframe error event
 * @param event - Error event
 */
const onError = (event: Event) => {
  iframeStore.onIframeError(frameId.value);
};
</script>

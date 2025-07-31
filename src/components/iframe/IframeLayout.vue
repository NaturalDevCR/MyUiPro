<template>
  <!-- Single Frame Layout -->
  <IframeRenderer
    v-if="layout.length === 1"
    :section-index="0"
    :src="computedMixerSrc"
    class="single-frame"
  />

  <!-- Two Frames Layout (Vertical Split) -->
  <q-splitter
    v-else-if="layout.length === 2 && !hasSubFrames"
    v-model="iframeStore.splitterModel"
    horizontal
    :style="{ height: '100%' }"
    :limits="iframeStore.splitterLimits"
    @update:model-value="iframeStore.onSplitterChange"
  >
    <template v-slot:before>
      <IframeRenderer
        :section-index="0"
        :src="computedMixerSrc"
      />
    </template>

    <template v-slot:after>
      <IframeRenderer
        :section-index="1"
        :src="computedMixerSrc"
      />
    </template>
  </q-splitter>

  <!-- Complex Layouts (3+ frames with nested splitters) -->
  <component
    v-else
    :is="renderNestedSplitters(layout, 0)"
    :style="{ height: '100%' }"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { QSplitter } from 'quasar';
import { useIframeStore } from 'stores/iframe-store';
import { useMixerStore } from 'stores/mixer-store';
import IframeRenderer from './IframeRenderer.vue';

// Props
interface Props {
  layout: any[];
}

const props = defineProps<Props>();

// Stores
const iframeStore = useIframeStore();
const mixerStore = useMixerStore();

// Computed
const hasSubFrames = computed(() => {
  return props.layout.some((section) => section.subFrames && section.subFrames > 1);
});

const computedMixerSrc = computed(() => {
  if (mixerStore.isDemoMode && mixerStore.ip) {
    const timestamp = Date.now();
    return `${mixerStore.ip}?t=${timestamp}&retry=${iframeStore.retryCount}`;
  }

  if (!mixerStore.ip || !mixerStore.isConnected) {
    return '';
  }

  const timestamp = Date.now();
  const baseUrl = `http://${mixerStore.ip}`;
  return `${baseUrl}?t=${timestamp}&retry=${iframeStore.retryCount}`;
});

// Methods
/**
 * Render nested splitters for complex layouts
 * @param sections - Layout sections to render
 * @param startIndex - Starting section index
 * @returns VNode for nested splitters
 */
const renderNestedSplitters = (sections: any[], startIndex: number): any => {
  if (sections.length === 1) {
    return renderSection(sections[0], startIndex);
  }

  if (sections.length === 2) {
    const splitterId = `vertical-${startIndex}-${startIndex + 1}`;
    const splitterPosition = iframeStore.verticalSplitterModels[splitterId] || 50;

    return h(
      QSplitter,
      {
        modelValue: splitterPosition,
        horizontal: true,
        limits: [15, 85],
        style: { height: '100%' },
        'onUpdate:modelValue': (val: number) => iframeStore.onVerticalSplitterChange(splitterId, val),
      },
      {
        before: () => renderSection(sections[0], startIndex),
        after: () => renderSection(sections[1], startIndex + 1),
      },
    );
  }

  // For more than 2 sections, split recursively
  const midPoint = Math.floor(sections.length / 2);
  const firstHalf = sections.slice(0, midPoint);
  const secondHalf = sections.slice(midPoint);
  const splitterId = `vertical-${startIndex}-${startIndex + sections.length - 1}`;
  const splitterPosition = iframeStore.verticalSplitterModels[splitterId] || 50;

  return h(
    QSplitter,
    {
      modelValue: splitterPosition,
      horizontal: true,
      limits: [15, 85],
      style: { height: '100%' },
      'onUpdate:modelValue': (val: number) => iframeStore.onVerticalSplitterChange(splitterId, val),
    },
    {
      before: () => renderNestedSplitters(firstHalf, startIndex),
      after: () => renderNestedSplitters(secondHalf, startIndex + midPoint),
    },
  );
};

/**
 * Render individual section with optional horizontal splitter
 * @param section - Layout section
 * @param sectionIndex - Section index
 * @returns VNode for section
 */
const renderSection = (section: any, sectionIndex: number): any => {
  if (section.subFrames && section.subFrames > 1) {
    const splitterPosition = iframeStore.horizontalSplitterModels[sectionIndex] || 50;

    return h(
      QSplitter,
      {
        modelValue: splitterPosition,
        horizontal: false,
        limits: [20, 80],
        style: { height: '100%' },
        'onUpdate:modelValue': (val: number) => iframeStore.onHorizontalSplitterChange(sectionIndex, val),
      },
      {
        before: () => h(IframeRenderer, {
          sectionIndex,
          subFrameIndex: 0,
          src: computedMixerSrc.value,
        }),
        after: () => h(IframeRenderer, {
          sectionIndex,
          subFrameIndex: 1,
          src: computedMixerSrc.value,
        }),
      },
    );
  }

  return h(IframeRenderer, {
    sectionIndex,
    src: computedMixerSrc.value,
  });
};
</script>
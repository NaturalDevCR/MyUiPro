<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useCommonStore } from 'stores/common-store';
import { useMixerStore } from './stores/mixer-store';
import { onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const mixerStore = useMixerStore();

const { locale } = useI18n({ useScope: 'global' });

const $q = useQuasar();
const commonStore = useCommonStore();

onMounted(() => {
  //Initialize visibility manager and connection monitoring on app startup
  console.log('Initializing visibility manager...');
  mixerStore.initVisibilityManager();

  $q.dark.set(true);
  if (!commonStore.lang) {
    commonStore.lang = $q.lang.getLocale()?.substring(0, 2) || 'en';
  } else {
    locale.value = ['en', 'es'].includes(commonStore.lang) ? commonStore.lang : 'en';
  }
});
/**
 * Cleanup on app destruction
 */
onUnmounted(() => {
  console.log('Cleaning up visibility manager...');
  mixerStore.cleanup();
});
</script>

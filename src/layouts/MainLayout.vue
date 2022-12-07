<template>
  <q-layout view="lHh Lpr lFf">
    <MixerSetupModal />
    <MixerShortcutsModal />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MixerSetupModal from 'components/mixerSetupModal.vue';
import MixerShortcutsModal from 'components/MixerShortcutsModal.vue';
</script>

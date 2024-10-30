<template>
  <q-layout view="lHh Lpr lFf">
    <TopBar />
    <MixerSetupModal />
    <PlayerModal />
    <MixerShortcutsModal />
    <MidiSetupModal />
    <LayoutSelector />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MixerSetupModal from 'components/mixerSetupModal.vue';
import MixerShortcutsModal from 'components/MixerShortcutsModal.vue';
import MidiSetupModal from 'components/midiSetupModal.vue';
import TopBar from 'components/TopBar.vue';
import LayoutSelector from 'components/LayoutSelector.vue';
import PlayerModal from 'components/PlayerModal.vue';
</script>

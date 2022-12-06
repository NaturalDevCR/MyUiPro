<template>
  <q-layout view="lHh Lpr lFf">
    <MixerSetupModal />
    <MixerShortcutsModal />
<!--    <LayoutsEditModal />-->
<!--    <AnalogUi16 />-->
<!--    <q-drawer-->
<!--      v-model="leftDrawerOpen"-->
<!--      show-if-above-->
<!--      bordered-->
<!--    >-->
<!--      <q-list>-->
<!--        <q-item-label-->
<!--          header-->
<!--        >-->
<!--          Essential Links-->
<!--        </q-item-label>-->

<!--      </q-list>-->
<!--    </q-drawer>-->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import MixerSetupModal from 'components/mixerSetupModal.vue';
import MixerShortcutsModal from 'components/MixerShortcutsModal.vue';
import LayoutsEditModal from 'components/LayoutsEditModal.vue';
// import AnalogUi16 from 'components/analogUi16.vue';


const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  toggleLeftDrawer()
})
</script>

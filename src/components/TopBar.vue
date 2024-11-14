<template>
  <q-page-container v-auto-animate>
    <q-bar
      v-if="!hideBar"
      dark
      :style="{background: '#343434!important', height: commonStore.barSize}"
      class="text-white"
    >
      <q-icon
        class="cursor-pointer text-white"
        color="dark"
        size="sm"
        @click="commonStore.barSize = '0px'; hideBar = true"
        name="mdi-arrow-collapse-vertical"
        round
      />
      <div
        v-show="!$q.platform.is.mobile && !mixerStore.showPlayerControls"
        class="text-bold orientation-landscape">
        {{mixerStore.mixerInfo.model}}
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]" class="bg-dark">
          <span class="text-h6">
            Firmware version: {{mixerStore.mixerInfo.firmware}}
          </span>
        </q-tooltip>
      </div>
      <q-space />
      <div style="border-color: gray; border-radius: 5px" class="row q-card--bordered q-pa-xs">
        <div v-if="!mixerStore.showPlayerControls" class="q-mr-xl">
          <q-btn @click="commonStore.modal.layoutSelector = true" color="dark" icon="mdi-monitor-screenshot" />
        </div>
        <div class="edit">
          <q-btn
            :disable="mixerStore.isDemoMode"
            padding="5px"
            size="sm"
            class="q-mr-xl"
            icon="mdi-music-circle"
            color="teal"
            @click="commonStore.modal.player = true"
          />
        </div>
        <div class="shortcuts">
          <q-btn
            :disable="mixerStore.isDemoMode"
            icon="mdi-open-in-new"
            color="dark"
            @click="mixerStore.shortcutsModal = true"
          />
        </div>
      </div>
      <q-space />
      <q-fab
        padding="4px"
        direction="down"
        color="dark"
        icon="mdi-cog"
      >
        <q-fab-action @click="mixerStore.setupModal = true" color="teal-5" icon="mdi-cog">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.settings')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="mixerStore.uiDisconnect()" color="red" icon="mdi-lan-disconnect">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.disconnect')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="reload(false)" icon="mdi-reload" color="dark">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.reload')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action v-if="$q.platform.is.desktop" @click="midiStore.midiSetupModal = true" icon="mdi-midi" color="green">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.midiSettings')}}</q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-bar>
    <q-page-sticky class="z-max" v-else :position="fabPos" :offset="fabOffset">
      <q-btn
        size="sm"
        @click="hideBar = false; commonStore.barSize = '55px'"
        dense
        round
        icon="mdi-arrow-split-horizontal"
        color="dark"
      />
    </q-page-sticky>
  </q-page-container>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {useMixerStore} from 'stores/mixer-store';
import {useQuasar} from 'quasar';
import {useCommonStore} from 'stores/common-store';
import {reload} from 'src/utils/helpers';
import {useMidiStore} from 'stores/midi-store';
import {useI18n} from 'vue-i18n';
const { t } = useI18n()

const mixerStore = useMixerStore()
const commonStore = useCommonStore()
const midiStore = useMidiStore()
const $q = useQuasar()

const hideBar = ref<boolean>(false)
const fabOffset = ref<number[]>([ 0, 15 ])
const fabPos = ref<any>('top')

onMounted(async () => {
  await mixerStore.uiConnect()
  midiStore.initSavedMidiDevice()
  $q.platform.is.mobile ? fabPos.value = 'top-left' : null
})
</script>

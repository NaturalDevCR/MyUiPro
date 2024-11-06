<template>
  <q-page-container v-auto-animate>
    <q-bar
      v-if="!hideBar"
      dark
      :style="{background: '#343434!important', height: commonStore.barSize}"
      class="text-white"
    >
      <q-btn
        color="dark"
        @click="commonStore.barSize = '0px'; hideBar = true"
        icon="mdi-arrow-collapse-vertical"
        round
      />
      <div
        v-show="!$q.platform.is.mobile && !mixerStore.showPlayerControls"
        class="text-bold orientation-landscape q-mr-sm">
        {{mixerStore.mixerInfo.model}}
        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]" class="bg-dark">
          <span class="text-h6">
            Firmware version: {{mixerStore.mixerInfo.firmware}}
          </span>

        </q-tooltip>
      </div>
      <div class="text-red text-bold" v-show="mixerStore.isDemoMode">DEMO MODE</div>
      <q-space />
      <div style="border-color: gray; border-radius: 5px" class="row q-card--bordered q-pa-xs orientation-landscape">
        <div v-if="!mixerStore.showPlayerControls" class="layout q-mr-xl">
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
import {computed, onMounted, ref, watch} from 'vue'
import {useMixerStore} from 'stores/mixer-store';
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';
import {useCommonStore} from 'stores/common-store';
import {reload} from 'src/utils/helpers';
import {useMidiStore} from 'stores/midi-store';

const mixerStore = useMixerStore()
const commonStore = useCommonStore()
const midiStore = useMidiStore()
const {t} = useI18n()
const $q = useQuasar()

const hideBar = ref<boolean>(false)
const fabOffset = ref<number[]>([ 0, 15 ])
const fabPos = ref<any>('top')

watch(() => mixerStore.connStatus, async (value: string) => {
  switch (true) {
    case value === 'OPEN':
      $q.notify({
        message: t(`connectionStatus.${mixerStore.connStatus}`),
        group: true,
        timeout: 2000,
        position: 'bottom',
        type: 'positive'
      })
      await mixerStore.listeners()
      break
    case value === 'OPENING':
      $q.notify({
        message: t(`connectionStatus.${mixerStore.connStatus}`),
        timeout: 500,
        group: true,
        position: 'bottom',
        color: 'orange',
        icon: 'mdi-alert'
      })
      break
    case value === 'CLOSE':
      $q.notify({
        message: t(`connectionStatus.${mixerStore.connStatus}`),
        timeout: 500,
        group: true,
        position: 'bottom',
        type: 'negative'
      })
      break
    default:
    //
  }
})

watch(() => mixerStore.layout, (value:number|string) => {
  // if (value === 'Custom'){
  //   //TODO: Create a custom layout by the user
  // }
  $q.notify({
    message: t('misc.layoutChooseMsg', {number: value})
  })
})

onMounted(async () => {
  await mixerStore.uiConnect()
  midiStore.initSavedMidiDevice()
  $q.platform.is.mobile ? fabPos.value = 'top-left' : null
})
const layouts = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3 (v1)',
    value: 3.1,
  },
  {
    label: '3 (v2)',
    value: 3.2,
  },
  {
    label: '4',
    value: 4,
  },
  {
    label: '5 (v1)',
    value: 5.1,
  },
  {
    label: '5 (v2)',
    value: 5.2,
  },
  {
    label: '5 (v3)',
    value: 5.3,
  },
  {
    label: '6',
    value: 6,
  },
]
</script>

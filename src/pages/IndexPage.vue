<template>
  <q-page class="bg-dark">
    <q-bar v-if="!hideBar" dark :style="{background: '#343434!important', height: commonStore.barSize}" class="text-white">
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
          <q-btn color="dark" :icon="layoutIcon">
            <q-menu dark fit>
              <q-list>
                <q-item
                  style="height: 40px"
                  class="text-center"
                  v-for="n in layouts"
                  :key="n.value"
                  dense
                  clickable
                >
                  <q-item-section class="" v-close-popup @click="mixerStore.layout = n.value">
                    {{n.label}}
                    <q-separator dark />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div class="edit">
          <q-btn
            v-if="!mixerStore.showPlayerControls"
            :disable="mixerStore.isDemoMode"
            padding="5px"
            size="sm"
            class="q-mr-xl"
            icon="mdi-music-circle"
            color="teal"
            @click="mixerStore.showPlayerControls = true"
          />

          <div v-else class="bg-blue-grey-8 rounded-borders row">
            <q-btn
              v-if="mixerStore.showPlayerControls"
              class="q-ma-xs"
              icon="mdi-home"
              padding="5px"
              color="teal"
              @click="mixerStore.showPlayerControls = false"
            />
            <q-btn
              @click="mixerStore.playerActions('prev')"
              class="q-ma-xs"
              icon="mdi-skip-previous"
              color="dark"
            />
            <q-btn
              @click="mixerStore.playerActions(mixerStore.mixerSettings.player.currentState === 2 ? 'pause' : 'play')"
              class="q-ma-xs"
              :icon="mixerStore.mixerSettings.player.currentState === 2 ? 'mdi-pause' : 'mdi-play'"
              :color="mixerStore.mixerSettings.player.currentState === 2 ? 'info' : 'dark'"
            />

            <div class="row justify-center items-center content-center">
              <span @click="getPlaylist" class="q-mx-sm col-12 text-center q-my-none text-sm q-my-none ellipsis">{{mixerStore.mixerSettings.player.currentTrack || 'No track selected'}}</span>
              <q-slider
                color="teal"
                style="margin-top: -8px; margin-bottom: -8px"
                class="q-py-none col-10"
                :inner-min="0"
                :inner-max="mixerStore.mixerSettings.player.currentLength"
                switch-label-side
                :label-value="mixerStore.currentElapsedTime"
                :model-value="mixerStore.mixerSettings.player.currentElapsedTime"
                disable
                label
                :label-always="[2, 3].includes(mixerStore.mixerSettings.player.currentState)"
                :min="0"
                :max="mixerStore.mixerSettings.player.currentLength"
              />
            </div>

            <q-btn
              @click="mixerStore.playerActions('stop')"
              class="q-ma-xs"
              icon="mdi-stop"
              color="dark"
            />
            <q-btn
              @click="mixerStore.playerActions('next')"
              class="q-ma-xs"
              icon="mdi-skip-next"
              color="dark"
            />
            <q-btn
              :disable="mixerStore.mixerSettings.recorder.dualTrack.isBusy"
              @click="mixerStore.dualTrackRecordToggle()"
              class="q-ma-xs"
              icon="mdi-record-circle"
              :color="mixerStore.mixerSettings.recorder.dualTrack.isRecording ? 'red' : 'red-3'"
            />
          </div>
        </div>
        <div v-if="!mixerStore.showPlayerControls" class="shortcuts">
          <q-btn
            :disable="mixerStore.isDemoMode"
            icon="mdi-open-in-new"
            color="dark"
            @click="mixerStore.shortcutsModal = true"
          />
        </div>
      </div>
      <q-space />
      <q-icon v-show="!$q.platform.is.mobile && !mixerStore.showPlayerControls" class="q-mr-md" v-if="mixerStore.isConnected" color="green" name="mdi-wifi-check" />
      <q-icon v-show="!$q.platform.is.mobile && !mixerStore.showPlayerControls" class="q-mr-md" v-else color="red" name="mdi-wifi-off" />
      <q-fab
        padding="10px"
        direction="down"
        color="dark"
        icon="keyboard_arrow_down"
      >
        <q-fab-action @click="mixerStore.setupModal = true" color="teal-5" icon="mdi-cog">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.settings')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="mixerStore.uiDisconnect()" color="red" icon="mdi-lan-disconnect">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.disconnect')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="reload" icon="mdi-reload" color="dark">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.reload')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="midiStore.midiSetupModal = true" icon="mdi-midi" color="green">
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

    <MultiFrames />
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {useMixerStore} from 'stores/mixer-store';
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';
import {useCommonStore} from 'stores/common-store';
import {reload} from 'src/utils/helpers';
import MultiFrames from 'components/MultiFrames.vue';
import {useMidiStore} from 'stores/midi-store';

const mixerStore = useMixerStore()
const commonStore = useCommonStore()
const midiStore = useMidiStore()
const {t} = useI18n()
const $q = useQuasar()

const hideBar = ref<boolean>(false)
const fabOffset = ref<number[]>([ 0, 15 ])
const fabPos = ref<any>('top')
const layoutIcon = computed(() => {
  switch (mixerStore.layout) {
    case 1:
      return 'mdi-numeric-1-box'
    case 2:
      return 'mdi-numeric-2-box-multiple'
    case 3.1:
      return 'mdi-numeric-3-box-multiple'
    case 3.2:
      return 'mdi-numeric-3-box-multiple-outline'
    case 4:
      return 'mdi-numeric-4-box-multiple'
    case 5.1:
      return 'mdi-numeric-5-box-multiple'
    case 5.2:
      return 'mdi-numeric-5-box-multiple-outline'
    case 5.3:
      return 'mdi-numeric-5-box'
    default:
      return 'mdi-view-grid-plus'
  }
})

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

const getPlaylist = () => {
  mixerStore.conn.conn.sendMessage('MEDIA_GET_PLISTS')
  mixerStore.conn.conn.sendMessage('NETCONFIG')
  mixerStore.getPlayerPlaylist()
}
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
  await midiStore.initSavedMidiDevice()
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

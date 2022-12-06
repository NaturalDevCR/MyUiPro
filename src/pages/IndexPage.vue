<template>
  <q-page class="bg-dark">
    <q-bar v-if="!hideBar" dark :style="{background: '#343434!important', height: barSize}" class="text-white">
<!--      <q-img  height="40px" width="40px" src="/icons/SUI-LOGO.png" alt="logo" class="cursor-pointer" @click="hideBar = true; barSize = '0px'" />-->
      <q-btn
        color="dark"
        @click="barSize = '0px'; hideBar = true"
        icon="mdi-arrow-collapse-vertical"
        round
      />
      <div v-show="!$q.platform.is.mobile && !mixerStore.showPlayerControls" class="text-bold orientation-landscape q-mr-sm">{{mixerStore.mixerModel}}</div>
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
            class="q-mr-xl"
            icon="mdi-arrow-left-right-bold"
            color="teal"
            @click="mixerStore.showPlayerControls = true"
          />
          <div v-else class="bg-blue-grey-8 rounded-borders row">
            <q-btn
              v-if="mixerStore.showPlayerControls"
              class="q-ma-xs"
              icon="mdi-arrow-left-right-bold"
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
              <span class="q-mx-sm col-12 text-center q-my-none text-sm q-my-none ellipsis">{{mixerStore.mixerSettings.player.currentTrack || 'No track selected'}}</span>
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
            icon="mdi-open-in-new"
            color="dark"
            @click="mixerStore.shortcutsModal = true"
          />
        </div>
      </div>
      <q-space />
<!--      <div v-if="!$q.platform.is.mobile">{{$t(`connectionStatus.${mixerStore.connStatus}`)}}</div>-->
      <q-icon v-show="!$q.platform.is.mobile && !mixerStore.showPlayerControls" class="q-mr-md" v-if="mixerStore.connStatus === 'OPEN'" color="green" name="mdi-wifi-check" />
      <q-icon v-show="!$q.platform.is.mobile && !mixerStore.showPlayerControls" class="q-mr-md" v-else color="red" name="mdi-wifi-off" />
      <q-fab
        padding="5px"
        direction="down"
        color="dark"
        icon="keyboard_arrow_down"
      >
        <q-fab-action @click="mixerStore.setupModal = true" color="teal" icon="mdi-cog">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.settings')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="mixerStore.uiDisconnect()" color="red" icon="mdi-lan-disconnect">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.disconnect')}}</q-tooltip>
        </q-fab-action>
        <q-fab-action @click="reload" icon="mdi-reload" color="teal">
          <q-tooltip class="bg-teal" anchor="center left" self="center right" :offset="[10, 10]">{{$t('misc.reload')}}</q-tooltip>
        </q-fab-action>
      </q-fab>
    </q-bar>
    <q-page-sticky v-else position="top" :offset="fabPos">
      <q-btn @click="hideBar = false; barSize = '55px'" dense round icon="mdi-arrow-split-horizontal" color="dark" />
    </q-page-sticky>

    <div v-if="mixerStore.ip && isIPv4(mixerStore.ip) && mixerStore.connStatus === 'OPEN'">
      <div class="q-pa-xs" v-if="mixerStore.layout === 1" :style="{height: `calc(100vh - ${barSize})`}">
        <div class="parent" style="height: 100%">
          <iframe ref="mixer1" id="mixer01" class="full-width" :src="mixerStore.mixerSrc" />
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 2" :style="{height: `calc(100vh - ${barSize})`}">
        <div class="parent" style="height: 50%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
        <div class="parent" style="height: 50%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 3.1" :style="{height: `calc(100vh - ${barSize})`}">
<!--        <frameset rows='*,60%' bordercolor='#C0C0C0'>-->
<!--          <frameset cols='50%,*' bordercolor='#C0C0C0'>-->
<!--            <frame :src="mixerStore.mixerSrc" />-->
<!--            <frame :src="mixerStore.mixerSrc" />-->
<!--          </frameset>-->
<!--          <frame :src="mixerStore.mixerSrc" />-->
<!--        </frameset>-->
        <div class="parent" style="height: 60%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
        <div class="parent" style="height: 40%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 3.2" :style="{height: `calc(100vh - ${barSize})`}">
        <!--        <frameset rows='*,60%' bordercolor='#C0C0C0'>-->
        <!--          <frameset cols='50%,*' bordercolor='#C0C0C0'>-->
        <!--            <frame :src="mixerStore.mixerSrc" />-->
        <!--            <frame :src="mixerStore.mixerSrc" />-->
        <!--          </frameset>-->
        <!--          <frame :src="mixerStore.mixerSrc" />-->
        <!--        </frameset>-->

        <div class="parent" style="height: 40%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
        <div class="parent" style="height: 60%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 4" :style="{height: `calc(100vh - ${barSize})`}">
        <div class="parent" style="height: 50%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
        <div class="parent" style="height: 50%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 5.1" :style="{height: `calc(100vh - ${barSize})`}">
        <div class="parent" style="height: 30%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
        <div class="parent" style="height: 35%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
        <div class="parent" style="height: 35%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 5.2" :style="{height: `calc(100vh - ${barSize})`}">
        <div class="parent" style="height: 35%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
        <div class="parent" style="height: 30%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
        <div class="parent" style="height: 35%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 5.3" :style="{height: `calc(100vh - ${barSize})`}">

        <div class="parent" style="height: 35%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
        <div class="parent" style="height: 35%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
        <div class="parent" style="height: 30%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
      </div>
      <div class="q-pa-xs" v-if="mixerStore.layout === 6" :style="{height: `calc(100vh - ${barSize})`}">

        <div class="parent" style="height: 25%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
        <div class="parent" style="height: 25%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
        <div class="parent" style="height: 25%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
        <div class="parent" style="height: 25%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </div>
      </div>

    </div>
    <div  style="height: calc(100vh - 45px)" v-else class="bg-red text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 30vh">
          <q-icon name="mdi-alert-remove-outline" color="white" />
        </div>

        <div class="text-h5" style="opacity:.8">
          {{$t('misc.disconnectedMsg')}}
        </div>

        <q-btn
          @click="reload"
          size="xl"
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          to="/"
          :label="$t('misc.reload')"
          no-caps
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {useMixerStore} from 'stores/mixer-store';
import {isIPv4} from 'is-ip';
import {useQuasar} from 'quasar';
const mixerStore = useMixerStore()
import {useI18n} from 'vue-i18n';
import LanguageSwitcher from 'components/languageSwitcher.vue';
const {t} = useI18n()
const $q = useQuasar()

const barSize = ref<string>('55px');

// const mixer1 = ref<any>()

// const onKeyPress = (e:any) => {
//   console.log(e.key)
//   const q:any = document.querySelector('#mixer01')
//   console.log(q.contentWindow)
//   q.contentWindow.postMessage(e.key, '*')
// }

const reload = () => {
  location.reload()
}
const hideBar = ref<boolean>(false)
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
watch(() => mixerStore.layout, (value:number|string) => {
  if (value === 'Custom'){
    //TODO: Create a custom layout by the user
  }
  $q.notify({
    message: t('misc.layoutChooseMsg', {number: value})
  })
})

const fabPos = ref([ 5, 5 ])
const draggingFab = ref(false)
const moveFab = (ev:any) => {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true

  fabPos.value = [
    fabPos.value[ 0 ] - ev.delta.x,
    fabPos.value[ 1 ] - ev.delta.y
  ]
}
onMounted(async () => {
  // window.addEventListener('keydown', onKeyPress)
  await mixerStore.uiConnect()
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
<style scoped>

</style>

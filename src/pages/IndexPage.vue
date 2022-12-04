<template>
  <q-page class="bg-dark">
    <q-bar v-if="!hideBar" dark :style="{background: '#343434!important', height: barSize}" class="text-white">
      <q-img height="40px" width="40px" src="/icons/SUI-LOGO.png" alt="logo" class="cursor-pointer" @click="hideBar = true; barSize = '0px'" />
      <div v-show="!$q.platform.is.mobile" class="text-bold orientation-landscape q-mr-sm">Soundcraft {{mixerStore.mixerModel}}</div>
      <q-space />
<!--      <q-input filled dark dense label="Mixer IP" color="white" v-model="mixerStore.ip" class="text-bold orientation-landscape" />-->
      <div style="border-color: gray; border-radius: 5px" class="row q-card--bordered q-pa-xs orientation-landscape">
        <div class="layout q-mr-md">
          <q-btn color="dark" :icon="layoutIcon">
            <q-tooltip class="bg-teal">Layout</q-tooltip>
            <q-menu dark fit>
              <q-list>
                <q-item
                  class="text-center"
                  v-for="n in 5"
                  :key="n"
                  dense
                  clickable
                >
                  <q-item-section v-close-popup @click="mixerStore.layout = n">{{n}}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div class="masterMute">
          <q-btn
            size="xs"
            padding="0"
            v-if="!mixerStore.masterMute"
            @click="mixerStore.muteGroup('all')"
            color="dark"
          >
            <q-tooltip class="bg-teal">Master Mute</q-tooltip>
            <div class="row">
              <q-icon class="col-12 q-pa-none q-ma-none" name="mdi-volume-high" />
              <p class="col-12 q-pa-none q-ma-none">Mute All</p>
            </div>
          </q-btn>
          <q-btn v-else
            size="xs"
            padding="0"
            @click="mixerStore.unMuteGroup('all')"
            color="red"
          >
            <q-tooltip class="bg-teal">Master Un-Mute</q-tooltip>
            <div class="row q-pa-none q-ma-none">
              <q-icon class="col-12 q-pa-none q-ma-none" name="mdi-volume-off" />
              <p v-if="!$q.platform.is.mobile" class="col-12 q-pa-none q-ma-none">Un-Mute All</p>
            </div>
          </q-btn>
        </div>

      </div>

      <q-space />
<!--      <div v-if="!$q.platform.is.mobile">{{$t(`connectionStatus.${mixerStore.connStatus}`)}}</div>-->
      <q-icon v-show="!$q.platform.is.mobile" class="q-mr-md" v-if="mixerStore.connStatus === 'OPEN'" color="green" name="mdi-wifi-check" />
      <q-icon v-show="!$q.platform.is.mobile" class="q-mr-md" v-else color="red" name="mdi-wifi-off" />

      <q-fab
        v-show="!$q.platform.is.mobile"
        disable
        class="orientation-landscape"
        padding="5px"
        direction="down"
        color="dark"
        icon="mdi-earth"
      >
        <q-fab-action square padding="5px" class="text-center bg-dark">
          <div class="text-center row content-center justify-center items-center">
            <country-flag country='cr' size='normal'/>
            Español
          </div>
        </q-fab-action>
        <q-fab-action square padding="5px" class="text-center bg-dark">
          <div class="text-center row content-center justify-center items-center">
            <country-flag country='us' size='normal'/>
            English
          </div>
        </q-fab-action>
      </q-fab>
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
    <q-bar v-else style="height: 0px" dark class="text-white cursor-pointer" @click="hideBar = false; barSize = '45px'">
      <q-space />
      <q-img v-if="!$q.platform.is.mobile" @click="hideBar = false; barSize = '45px'" height="40px" width="40px" src="/icons/SUI-LOGO.png" alt="logo" class="cursor-pointer q-mt-xl" />
      <q-img v-else @click="hideBar = false; barSize = '45px'" height="30px" width="30px" src="/icons/SUI-LOGO.png" alt="logo" class="cursor-pointer q-mt-xl offset-3" />
      <q-space />
    </q-bar>
    <div v-if="mixerStore.ip && isIPv4(mixerStore.ip) && mixerStore.connStatus === 'OPEN'">
      <div class="q-pa-xs" v-if="mixerStore.layout === 1" :style="{height: `calc(100vh - ${barSize})`}">
        <div class="parent" style="height: 100%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
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
      <div class="q-pa-xs" v-if="mixerStore.layout === 3" :style="{height: `calc(100vh - ${barSize})`}">
        <div class="parent" style="height: 35%">
          <iframe class="full-width" :src="mixerStore.mixerSrc" />
        </div>
        <div class="parent" style="height: 65%">
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
          <div class="full-height">
            <iframe class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
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
      <div class="q-pa-xs" v-if="mixerStore.layout === 5" :style="{height: `calc(100vh - ${barSize})`}">
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
import CountryFlag from 'vue-country-flag-next'
import {useMixerStore} from 'stores/mixer-store';
import {isIPv4} from 'is-ip';
import {useQuasar} from 'quasar';
const mixerStore = useMixerStore()
// const layout = ref<number | string>(3)
import {useI18n} from 'vue-i18n';
const {t} = useI18n()
const $q = useQuasar()
const onClick = () => {
  console.log('click')
  // conn.value.master.setFaderLevelDB(0.9);
  // conn.value.master.input(5).solo();
  // console.log(conn.value.master)
}
const barSize = ref<string>('45px');
// const fabPos = ref([ 0, 0 ])
// const draggingFab = ref(false)
// const moveFab = (ev:any) => {
//   draggingFab.value = ev.isFirst !== true && ev.isFinal !== true
//
//   fabPos.value = [
//     fabPos.value[ 0 ] - ev.delta.x,
//     fabPos.value[ 1 ] - ev.delta.y
//   ]
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
    case 3:
      return 'mdi-numeric-3-box-multiple'
    case 4:
      return 'mdi-numeric-4-box-multiple'
    case 5:
      return 'mdi-numeric-5-box-multiple'
    default:
      return 'mdi-view-grid-plus'
  }
})

watch(() => mixerStore.connStatus, async (value: string) => {
  // $q.notify({
  //   message: t(`connectionStatus.${mixerStore.connStatus}`),
  //   timeout: 500,
  //   position: 'bottom',
  // })
  if (value === 'OPEN'){

    $q.notify({
      message: t(`connectionStatus.${mixerStore.connStatus}`),
      group: true,
      timeout: 2000,
      position: 'bottom',
      type: 'positive'
    })
    await mixerStore.listeners()
  } else if (value === 'OPENING'){
    $q.notify({
      message: t(`connectionStatus.${mixerStore.connStatus}`),
      timeout: 500,
      group: true,
      position: 'bottom',
      color: 'orange',
      icon: 'mdi-alert'
    })
  } else {
    $q.notify({
      message: t(`connectionStatus.${mixerStore.connStatus}`),
      timeout: 500,
      group: true,
      position: 'bottom',
      type: 'negative'
    })
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
onMounted(async () => {
  await mixerStore.uiConnect()
})
</script>
<style scoped>
.parent { display: -ms-flex; display: -webkit-flex; display: flex; }
.parent>div { flex:1; align-items: stretch; resize: both; overflow: auto }
</style>

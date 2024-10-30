<template>
  <q-page class="bg-dark">
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

<template>
  <q-page style="min-height: 100%" class="bg-dark">
    <div v-if="showMixerContent" :class="disableClass">
      <div class="q-pa-xs" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
        <IFrame />
      </div>
    </div>
    <div v-else :style="{height: `calc(100vh - ${commonStore.barSize})`}" class="bg-dark text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 30vh">
          <q-icon name="mdi-alert-remove-outline" color="white" />
        </div>
        <div class="text-h5" style="opacity:.8">
          {{t('misc.disconnectedMsg')}}
        </div>
        <q-btn
          @click="reload(true)"
          size="xl"
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          to="/"
          :label="t('misc.reload')"
          no-caps
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import {useMixerStore} from 'stores/mixer-store';
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';
import {useMidiStore} from 'stores/midi-store';
import {reload} from 'src/utils/helpers';
const { t } = useI18n()

const mixerStore = useMixerStore();
const midiStore = useMidiStore();

import {useCommonStore} from 'stores/common-store';
import IFrame from 'components/IFrame.vue';
const commonStore = useCommonStore();

const $q = useQuasar()

const fabPos = ref<any>('top')

const getPlaylist = () => {
  mixerStore.conn.conn.sendMessage('MEDIA_GET_PLISTS')
  mixerStore.conn.conn.sendMessage('NETCONFIG')
  mixerStore.getPlayerPlaylist()
}

const disableClass = ref<string>('');

const showMixerContent = computed(() =>
  mixerStore.isConnected || mixerStore.isDemoMode
);

onMounted(async () => {
  console.log(document.location.host)
  if (mixerStore.ip) {
    await mixerStore.uiConnect()
  }

  if ($q.platform.is.desktop){
    midiStore.initSavedMidiDevice()
  }
  $q.platform.is.mobile ? fabPos.value = 'top-center' : null

  disableClass.value = 'disable';

})
</script>

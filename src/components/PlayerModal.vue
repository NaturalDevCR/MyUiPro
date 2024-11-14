<template>
  <q-dialog v-model="commonStore.modal.player" position="top">
    <q-card flat>
      <q-card-section class="row items-center q-pa-xs no-wrap">
        <div class="bg-blue-grey-8 rounded-borders row">
          <q-btn
            dense
            @click="mixerStore.playerActions('prev')"
            class="q-ma-xs"
            icon="mdi-skip-previous"
            color="dark"
          />
          <q-btn
            dense
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
            dense
            @click="mixerStore.playerActions('stop')"
            class="q-ma-xs"
            icon="mdi-stop"
            color="dark"
          />
          <q-btn
            dense
            @click="mixerStore.playerActions('next')"
            class="q-ma-xs"
            icon="mdi-skip-next"
            color="dark"
          />
          <q-btn
            dense
            :disable="mixerStore.mixerSettings.recorder.dualTrack.isBusy"
            @click="mixerStore.dualTrackRecordToggle()"
            class="q-ma-xs"
            icon="mdi-record-circle"
            :color="mixerStore.mixerSettings.recorder.dualTrack.isRecording ? 'red' : 'red-3'"
          />
        </div>
      </q-card-section>
<!--      <q-linear-progress :value="0.6" color="teal" />-->
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useCommonStore} from 'stores/common-store';
import {useMixerStore} from 'stores/mixer-store';

const mixerStore = useMixerStore()
const commonStore = useCommonStore()

const getPlaylist = () => {
  mixerStore.conn.conn.sendMessage('MEDIA_GET_PLISTS')
  mixerStore.conn.conn.sendMessage('NETCONFIG')
  mixerStore.getPlayerPlaylist()
}
</script>

<style scoped lang="scss">

</style>

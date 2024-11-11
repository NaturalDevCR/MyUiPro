<template>
<!--  {{layoutsStore.selectedLayout}}-->
  <div v-for="(section, index) in layoutsStore.selectedLayout" :key="index" class="parent" :style="{height: section.height}">
    <template v-if="section.frameIDs">
      <div v-for="(frame, frameIndex) in section.frameIDs" :key="frameIndex" class="full-height">
<!--        Frame SRC: {{mixerStore.mixerSrc + getID(frame)}}-->
        <iframe
          :allowFullScreen="false"
          class="full-width full-height"
          :src="mixerStore.mixerSrc + getID(frame)"
        />
      </div>
    </template>
    <iframe
      v-else
      :key="index"
      :allowFullScreen="false"
      class="full-width"
      :src="mixerStore.mixerSrc + getID(section.id)"
    />
<!--    Section SRC: {{mixerStore.mixerSrc + getID(section.id)}}-->
  </div>
</template>

<script setup lang="ts">

import {useLayoutsStore} from 'stores/layouts-store';
import {useMixerStore} from 'stores/mixer-store';

const mixerStore = useMixerStore();

const layoutsStore = useLayoutsStore()

const default_id = 'SYNC_ID'

const getID = (id: string) => {
  if (layoutsStore.defaultSyncID) {
    return default_id
  } else {
    return id
  }
}

</script>

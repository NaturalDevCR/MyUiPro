<template>
  <div v-for="(section, key) in layoutsStore.selectedLayout" :key="key" class="parent" :style="{height: section.height}">
    <template v-if="section.subFrames">
      <div v-for="(subFrame) in section.subFrames" :key="'subFrame' + subFrame">
        <iframe
          :allowFullScreen="false"
          class="full-width full-height"
          :src="mixerStore.mixerSrc"
        />
      </div>
    </template>
    <iframe
      v-else
      :key="key"
      :allowFullScreen="false"
      class="full-width full-height"
      :src="mixerStore.mixerSrc"
    />
  </div>
</template>

<script setup lang="ts">

import {useLayoutsStore} from 'stores/layouts-store';
import {useMixerStore} from 'stores/mixer-store';

const mixerStore = useMixerStore();

const layoutsStore = useLayoutsStore()

</script>

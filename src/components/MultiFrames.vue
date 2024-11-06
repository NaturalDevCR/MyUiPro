<template>
  <div class="disable-hardware-acceleration" :class="disableClass" v-if="showMixerContent">
    <div class="q-pa-xs" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
      <div v-for="(section, index) in layoutSections" :key="index" class="parent" :style="{height: section.height}">
        <template v-if="section.frames">
          <div v-for="frame in Array(section.frames).fill(null)" :key="frame" class="full-height">
            <iframe :allowFullScreen="false" class="full-width full-height" :src="mixerStore.mixerSrc" />
          </div>
        </template>
        <iframe v-else :allowFullScreen="false" class="full-width" :src="mixerStore.mixerSrc" />
      </div>
    </div>
  </div>
  <div v-else :style="{height: `calc(100vh - ${commonStore.barSize})`}" class="bg-dark text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        <q-icon name="mdi-alert-remove-outline" color="white" />
      </div>
      <div class="text-h5" style="opacity:.8">
        {{$t('misc.disconnectedMsg')}}
      </div>
      <q-btn
        @click="reload(true)"
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
</template>

<script setup lang="ts">
import {useMixerStore} from 'stores/mixer-store';
import {useCommonStore} from 'stores/common-store';
import {reload} from 'src/utils/helpers';
import {isIPv4} from 'is-ip';
import {computed, onMounted, ref} from 'vue';
import { useQuasar } from 'quasar'
const $q = useQuasar();

const mixerStore = useMixerStore();
const commonStore = useCommonStore();
const disableClass = ref<string>('');

// Define the configuration map for each layout
const layoutConfig:any = {
  1: [{ height: '100%' }],
  2: [{ height: '50%' }, { height: '50%' }],
  3.1: [{ height: '40%', frames: 2 }, { height: '60%' }],
  3.2: [{ height: '60%' }, { height: '40%', frames: 2 }],
  4: [{ height: '50%', frames: 2 }, { height: '50%', frames: 2 }],
  5.1: [{ height: '30%' }, { height: '35%', frames: 2 }, { height: '35%', frames: 2 }],
  5.2: [{ height: '35%', frames: 2 }, { height: '30%' }, { height: '35%', frames: 2 }],
  5.3: [{ height: '35%', frames: 2 }, { height: '35%', frames: 2 }, { height: '30%' }],
  6: [{ height: '25%', frames: 2 }, { height: '25%' }, { height: '25%' }, { height: '25%', frames: 2 }]
};

onMounted(() => {
  disableClass.value = 'disable';
});

// Compute whether to show the mixer content
const showMixerContent = computed(() =>
  mixerStore.ip && isIPv4(mixerStore.ip) && mixerStore.isConnected || mixerStore.isDemoMode
);

// Autogenerate layout sections based on configuration
const layoutSections = computed(() => layoutConfig[mixerStore.layout] || []);
</script>

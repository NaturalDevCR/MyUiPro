<template>
  <div v-if="mixerStore.ip && isIPv4(mixerStore.ip) && mixerStore.connStatus === 'OPEN'  || mixerStore.isDemoMode">
    <div class="q-pa-xs" v-if="mixerStore.layout === 1" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
      <div class="parent" style="height: 100%">
        <iframe ref="mixer1" id="mixer01" class="full-width" :src="mixerStore.mixerSrc" />
      </div>
    </div>
    <div class="q-pa-xs" v-if="mixerStore.layout === 2" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
      <div class="parent" style="height: 50%">
        <iframe class="full-width" :src="mixerStore.mixerSrc" />
      </div>
      <div class="parent" style="height: 50%">
        <iframe class="full-width" :src="mixerStore.mixerSrc" />
      </div>
    </div>
    <div class="q-pa-xs" v-if="mixerStore.layout === 3.1" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
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
    <div class="q-pa-xs" v-if="mixerStore.layout === 3.2" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
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
    <div class="q-pa-xs" v-if="mixerStore.layout === 4" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
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
    <div class="q-pa-xs" v-if="mixerStore.layout === 5.1" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
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
    <div class="q-pa-xs" v-if="mixerStore.layout === 5.2" :style="{height: `calc(100vh - ${commonStore.barSize})`}">
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
    <div class="q-pa-xs" v-if="mixerStore.layout === 5.3" :style="{height: `calc(100vh - ${commonStore.barSize})`}">

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
    <div class="q-pa-xs" v-if="mixerStore.layout === 6" :style="{height: `calc(100vh - ${commonStore.barSize})`}">

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
  <div v-else :style="{height: `calc(100vh - ${commonStore.barSize})`}" class="bg-red text-white text-center q-pa-md flex flex-center">
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
</template>

<script setup lang="ts">
import {useMixerStore} from 'stores/mixer-store';
import {useCommonStore} from 'stores/common-store';
import {reload} from 'src/utils/helpers';
import {isIPv4} from 'is-ip';

const mixerStore = useMixerStore()
const commonStore = useCommonStore()

</script>

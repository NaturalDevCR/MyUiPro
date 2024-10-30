<template>
  <q-dialog v-model="commonStore.modal.layoutSelector">
    <q-card style="width: 400px;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Layout Selector</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-scroll-area dark class="q-pa-lg" :visible="false" style="height: 400px; max-width: 400px;">
          <div class="row q-col-gutter-sm">
            <div @click="mixerStore.layout = 1" class=" col-6 row text-center">
              <div class="col-12">1 Frame</div>
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="100px" />
              </div>
            </div>
            <div @click="mixerStore.layout = 2" class=" col-6 row text-center">
              <div class="col-12">2 Frames</div>
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <q-separator class="col-12" />
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
          </div>
          <q-separator spaced />
          <div class="row q-col-gutter-sm">
            <div @click="mixerStore.layout = 3.1" class="col-6 row text-center">
              <div class="col-12">3 Frames (v1)</div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
            <div @click="mixerStore.layout = 3.2" class="col-6 row text-center">
              <div class="col-12">3 Frames (v2)</div>
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
          </div>
          <q-separator spaced />
          <div class="row q-col-gutter-sm">
            <div @click="mixerStore.layout = 4" class="col-6 row text-center">
              <div class="col-12">4 Frames</div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="50px" />
              </div>
            </div>
            <div @click="mixerStore.layout = 5.1" class="col-6 row text-center">
              <div class="col-12">5 Frames (v1)</div>
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
            </div>
          </div>
          <q-separator spaced />
          <div class="row q-col-gutter-sm">
            <div @click="mixerStore.layout = 5.2" class="col-6 row text-center">
              <div class="col-12">5 Frames (v2)</div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
            </div>
            <div @click="mixerStore.layout = 5.3" class="col-6 row text-center">
              <div class="col-12">5 Frames (v3)</div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-6">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
              <div class="col-12">
                <q-skeleton class="cursor-pointer" bordered height="33px" />
              </div>
            </div>
          </div>
        </q-scroll-area>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useCommonStore} from 'stores/common-store';
import {useMixerStore} from 'stores/mixer-store';
import {watch} from 'vue';
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';

const commonStore = useCommonStore()
const mixerStore = useMixerStore()
const $q = useQuasar();
const {t} = useI18n()

watch(() => mixerStore.layout, (value:number|string) => {
  // if (value === 'Custom'){
  //   //TODO: Create a custom layout by the user
  // }
  $q.notify({
    message: t('misc.layoutChooseMsg', {number: value}),
    group: true,
  })
})
</script>

<template>
  <q-dialog
    v-model="mixerStore.analogUi16Modal"
    persistent
    maximized
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="background: #343434" class="text-white">
      <q-bar style="height: 50px">
        <q-space />
        <div>
          Analog Ui16
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

<!--      <q-card-section>-->
<!--        <div class="text-h6">Alert</div>-->
<!--      </q-card-section>-->
      <q-card-section class="bg-dark">
        <q-scroll-area dark style="height: calc(100vh - 80px); max-width: 100vw;">
          <div class="q-pa-xs" style="height: calc(100vh - 80px); width: 100vw">
            <div class="row text-center justify-center content-center items-center">
              <q-card dark v-for="(top, i) in channels" :key="i" style="max-width: 100px!important; border-color: rgba(255,255,255,0.37); border-style: groove; height: 150px" class="full-height text-center items-center col q-mx-auto bg-black q-pa-none">
                <q-card-section>
                  <span class="text-bold" v-if="channels[i].volume >= 10">10db</span>
                  <span class="text-bold" v-else-if="channels[i].volume > -95">{{channels[i].volume.toFixed(2)}}db</span>
                  <span v-else class="text-bold">-inf</span>
                </q-card-section>
              </q-card>
            </div>
            <div class="row text-center justify-center content-center items-center">
              <div v-for="(bottom, i) in channels" :key="i" style="max-width: 100px!important; border-color: rgba(255,255,255,0.37); border-style: groove;" class="full-height items-center col q-mx-auto bg-black q-pt-md">
                <div class="row q-ma-xs text-center items-center content-center justify-center">
                  <div class="col-12">
                    <q-slider
                      :label-value="`${channels[i].pan === 0.5 ? 'CENTER' : channels[i].pan < 0 ? 'L' : 'R'} ${channels[i].pan !== 0.5 ? '-' + channels[i].pan : ''}`"
                      class=""
                      snap
                      track-size="10px"
                      thumb-size="25px"
                      label
                      v-model="channels[i].pan"
                      color="green"
                      track-color="orange"
                      inner-track-color="transparent"
                      selection-color="red"
                      :max="1"
                      :step="0.1"
                      :min="0"
                      markers
                    />
                  </div>

                </div>
                <div class="row q-ma-xs text-center items-center content-center justify-center">
                  <q-btn dense class="col-5" color="red" label="M"><q-tooltip>Mute</q-tooltip></q-btn> -
                  <q-btn dense class="col-5" text-color="black" color="yellow" label="S" ><q-tooltip>Solo</q-tooltip></q-btn>
                </div>
                <q-space />
                <q-separator dark class="q-ma-md" />
                <div class="row items-center content-center justify-center q-my-sm">
                  <div class="col-12">
                    <slider
                      :handleScale="0.1"
                      class="col-12"
                      :max="20000"
                      :min="20"
                      :circleOffset="180"
                      tooltip
                      tooltipText="%vhz"
                      :height="5"
                      width="100%"
                      orientation="circular"
                      v-model="channels[i].eq.bands.a.freq"
                      color="#FFFFFF"
                      track-color="rgba(30,30,30,0.67)"
                      :step="1"
                    />
                  </div>

                </div>
                <div class="row items-center content-center justify-center q-mb-sm">
                  <slider
                    sticky
                    :handleScale="1.50"
                    class="stripe-5 col-12"
                    alwaysShowHandle
                    :max="40"
                    :min="-99"
                    tooltip
                    tooltipText="%vdb"
                    :height="30"
                    width="20vw"
                    orientation="vertical"
                    v-model="channels[i].volume"
                    :color="dbColor(channels[i].volume)"
                    track-color="rgba(30,30,30,0.67)"
                    :step="0.10"
                  />
                </div>
              </div>
            </div>
            <div class="row text-center justify-center content-center items-center">
              <q-card dark v-for="(top, i) in channels" :key="i" style="max-width: 100px!important; border-color: rgba(255,255,255,0.37); border-style: groove; height: 150px" class="full-height text-center items-center col q-mx-auto bg-black q-pa-none">
                <q-card-section>
                  <span class="text-bold">Ch{{i + 1}}</span>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useMixerStore} from 'stores/mixer-store';
import {onMounted, ref} from 'vue'
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';
const mixerStore = useMixerStore()

import slider from "vue3-slider"

const $q = useQuasar()
const { t } = useI18n()
const channels = ref<Array<object>>([])

const dbColor = (dbValue:string|number) => {
  // console.log(dbValue)
  return '#d5d4d4'
  // switch (true) {
  //   case dbValue <= -40:
  //     return '#122154'
  //   case dbValue <= -20:
  //     return '#264095'
  //   case dbValue <= -10:
  //     return '#193712'
  //   case dbValue <= -5:
  //     return '#28541d'
  //   case dbValue <= 0:
  //     return '#389023'
  //   case dbValue <= 3:
  //     return '#5b2020'
  //   case dbValue <= 5:
  //     return '#9b2e2e'
  //   case dbValue <= 10:
  //     return '#ff0000'
  //   default:
  //     return '#FFFFFF'
  //
  // }
}

onMounted(() => {
  const ch = 15
  for (let i = 0; i <= ch; i++){
    channels.value.push({
      label: '',
      volume: 0,
      gain: 0,
      pan: 0.5,
      eq: {
        bypass: false,
        hpf: {},
        lpf: {},
        deEsser: {},
        easyEQ: false,
        bands: {
          a: {
            freq: 200,
            q: 1.00,
            gain: 0.0,
          },
          b: {
            freq: 997,
            q: 1.00,
            gain: 0.0,
          },
          c: {
            freq: 4000,
            q: 1.00,
            gain: 0.0,
          },
          d: {
            freq: 10000,
            q: 1.00,
            gain: 0.0,
          }
        }
      },
      gate: {},
      comp: {},
      fx: {},
      phantom: false,
      stereoLink: false,
      mute: false,
      solo: false,
      rta: false,
    })
  }

  console.log(channels.value)
})
</script>
<style lang="scss">
.parent { display: -ms-flex; display: -webkit-flex; display: flex; }
.parent>div { flex:1; align-items: stretch; height: 10px }

.vue3-slider .tooltip {
  z-index: 9999999999 !important;
}
.vue3-slider.vertical .tooltip {
  z-index: 9999999999 !important;
}
.tooltip {
  z-index: 9999999999 !important;
}
//.module {
  //background: white;
  //border: 1px solid #ccc;
  //margin: 3%;
//> h2 {
//  padding: 1rem;
//  margin: 0 0 0.5rem 0;
//}
//> p {
//  padding: 0 1rem;
//}
//}

.stripe-5 {
  color: white;
  border-radius: 5px;
  background: linear-gradient(
    to bottom,
      #ffffff,
      #ffffff 50%,
      #dedede 50%,
      #dedede
  );
  background-size: 100% 10px;
}

.vue3-slider .track, .vue3-slider .track-filled {
  //background-color: var(--track-color,rgba(241,246,248,.156863));
  //width: 100%;
  //height: 100%;
  border-radius: 5px!important;
}

.vue3-slider .handle {
  width: 30px;
  height: 20px;
  border-radius: 4px !important;
  border: 2px;
  border-style: solid;
  color: #5a5959;
  background: linear-gradient(
      to bottom,
      #ffffff,
      #ffffff 50%,
      #dedede 50%,
      #dedede
  );
  background-size: 100% 10px;
}
</style>

<template>
  <q-dialog
    v-model="mixerStore.setupModal"
    persistent
    maximized
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="background: #343434" class="text-white">
      <q-bar style="height: 50px">
        <q-space />
        <div>
          {{$t('setupModal.title')}}
        </div>
<!--        <q-btn dense flat icon="close" v-close-popup>-->
<!--          <q-tooltip class="bg-white text-primary">Close</q-tooltip>-->
<!--        </q-btn>-->
        <q-space />
      </q-bar>

<!--      <q-card-section>-->
<!--        <div class="text-h6">Alert</div>-->
<!--      </q-card-section>-->

      <q-card-section class="">
        <q-stepper
          header-nav
          dark
          v-model="step"
          vertical
          color="teal"
          animated
        >
          <q-step
            color="teal-3"
            :name="1"
            :title="$t('setupModal.stepper.step1.title')"
            icon="settings"
            :done="step > 1"
          >
            {{$t('setupModal.stepper.step1.text')}}
            <br />
            <q-btn-toggle
              class="q-my-md"
              v-model="mixerStore.mixerModel"
              push
              color=""
              glossy
              toggle-color="teal"
              :options="[
                {label: 'Ui12', value: 'Ui12'},
                {label: 'Ui16', value: 'Ui16'},
                {label: 'Ui24r', value: 'Ui24r'}
              ]"
            />
            <q-stepper-navigation>
              <q-btn @click="step = 2" color="teal" :label="$t('misc.continue')" />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="2"
            color="teal-3"
            :title="$t('setupModal.stepper.step2.title')"
            icon="mdi-tune-vertical"
            :done="step > 2"
          >
            {{$t('setupModal.stepper.step2.text')}}
            <br />
            <div class="row">
              <div class="col-4">
                <q-input
                  :rules="[val => !!val || $t('validation.required'), val => isIPv4(val) || $t('validation.invalidIP')]"
                  dark
                  v-model="mixerStore.ip"
                  label="Mixer IP"
                  color="white"
                />
              </div>
            </div>
            <q-stepper-navigation>
              <q-btn @click="step = 3" color="teal" :label="$t('misc.continue')" />
              <q-btn flat @click="step = 1" color="orange" :label="$t('misc.back')" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

          <q-step
            :name="3"
            color="teal-3"
            :title="$t('setupModal.stepper.step3.title')"
            icon="mdi-tune-vertical"
            :done="step > 3"
          >
            {{$t('setupModal.stepper.step3.text')}}
            <br />
            <q-stepper-navigation>
              <q-btn @click="mixerStore.setupModal = false; mixerStore.uiConnect()" color="teal" :label="$t('misc.continue')" />
              <q-btn flat @click="step = 1" color="orange" :label="$t('misc.back')" class="q-ml-sm" />
            </q-stepper-navigation>
          </q-step>

        </q-stepper>
      </q-card-section>
      <q-card-actions class="row justify-center q-mt-xl">
        <span class="text-center col-12">Made with ♥ by Josue Orozco A. | Costa Rica | Natural Cloud | @2022</span>
        <br />
        <a class="text-white col-12 text-center" href="mailto:jdavidoa91@gmail.com">Send me a message, suggestion, or request</a>

        <div class="col-12 col-md-2 text-center q-mt-md q-pa-md" style="border: 2px dashed orange;border-radius: 5px">
          <q-btn icon="mdi-gift" label="Buy me a coffee" target="_blank" href="https://www.paypal.com/donate/?hosted_button_id=A8MKF5RNGQ77U" color="orange" />
        </div>
        <span class="text-center col-12 text-bold q-mt-md">My Ui Pro - v1.0.0</span>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useMixerStore} from 'stores/mixer-store';
import {ref, watch} from 'vue'
import {useQuasar} from 'quasar';
import {useI18n} from 'vue-i18n';
const mixerStore = useMixerStore()
const step = ref<number>(1)
const $q = useQuasar()
const { t } = useI18n()
import {isIPv4} from 'is-ip';

watch(step, (value:number) => {
  console.log(value)
  if (!mixerStore.mixerModel && [2, 3, 4].includes(value)) {
    $q.notify({
      message: t('setupModal.errors.noModel'),
      type: 'negative',
      timeout: 5000,
      position: 'center'
    })
    step.value = 1
  }
  if ((!mixerStore.ip || !isIPv4(mixerStore.ip)) && [3, 4].includes(value)) {
    $q.notify({
      message: t('setupModal.errors.noIP'),
      type: 'negative',
      timeout: 5000,
      position: 'center'
    })
    step.value = 2
  }
})
</script>

<template>
  <q-dialog
    v-model="mixerStore.passwordAccessModal"
    :maximized="$q.platform.is.mobile"
    :persistent="mixerStore.isConnected"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="background: #343434" class="text-white">
      <q-bar style="height: 50px">
        <q-space />
        <div>
          {{$t('setupModal.title')}}
        </div>
        <q-space />
        <LanguageSwitcher />
      </q-bar>

      <q-card-section class="">
        <q-card dark>
          <q-card-section>
            <div class="row justify-center items-center text-center">
              <div class="col-6">
                <q-input
                  @change="mixerIPHasChanged = true"
                  outlined
                  input-class="text-center text-h5"
                  :rules="[val => !!val || $t('validation.required'), val => isValidMixerIp(mixerStore.ip) || $t('validation.invalidIP')]"
                  dark
                  v-model="mixerStore.ip"
                  label="Mixer IP"
                  color="teal"
                />
              </div>
              <div class="q-pa-md">{{$t('setupModal.advice')}}</div>
              <div class="col-12 col-md-12 text-center q-mt-md q-pa-md">
                <q-btn :disable="!isValidMixerIp(mixerStore.ip)" icon="mdi-connection" :label="$t('misc.connect')" @click="finishSetup" color="teal" />
              </div>
            </div>
          </q-card-section>
<!--          <q-card-section v-if="mixerStore.isConnected" class="row justify-center">-->
<!--            <q-btn class="col-12 col-md-6" label="Show master password" color="red" @click="getMasterPassword" />-->
<!--            <div v-show="showMasterPassword" class="text-center col-12 q-my-md">Your master password is: </div>-->
<!--            <div v-show="showMasterPassword" class="text-center col-12 text-bold text-h6">{{mixerStore.mixerPassword}} </div>-->
<!--          </q-card-section>-->
        </q-card>
      </q-card-section>
      <q-card-actions class="row justify-center">
        <div class="col-12 col-md-12 text-center q-mt-md q-pa-md">
          <q-btn icon="mdi-gift" :label="$t('misc.supportMe')" target="_blank" href="https://www.paypal.com/donate/?hosted_button_id=A8MKF5RNGQ77U" color="orange" />
        </div>
        <span class="text-center col-12">Made with ♥ by Josue Orozco A. | Costa Rica | Natural Cloud | @2022</span>
        <br />
        <a class="text-white col-12 text-center" href="mailto:jdavidoa91@gmail.com">Send me a message, suggestion, or request</a>
        <span class="text-center col-12 text-bold q-mt-md">My Ui Pro - v{{commonStore.version}}</span>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useMixerStore} from 'stores/mixer-store';
import {useQuasar} from 'quasar';
import {ref} from 'vue'
// import {useI18n} from 'vue-i18n';
// const { t } = useI18n()
const mixerStore = useMixerStore()
const commonStore = useCommonStore()
const $q = useQuasar()
const mixerIPHasChanged = ref<boolean>(false)
// const showMasterPassword = ref<boolean>(false)

import { isValidMixerIp } from 'src/utils/helpers';

import {useCommonStore} from 'stores/common-store';
import LanguageSwitcher from 'components/languageSwitcher.vue';

//Maybe this is a little dangerous
// const getMasterPassword = () => {
//   mixerStore.getMixerPassword()
//   showMasterPassword.value = !showMasterPassword.value
// }
const finishSetup = () => {
  mixerStore.setupModal = false;
  if (mixerStore.isConnected || mixerIPHasChanged.value){
    mixerStore.uiConnect()
  }

}
</script>

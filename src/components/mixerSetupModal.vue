<template>
  <q-dialog
    v-model="mixerStore.setupModal"
    :maximized="$q.platform.is.mobile"
    :persistent="!mixerStore.isConnected"
    transition-show="slide-down"
    backdrop-filter="blur(50px)"
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
                  :disable="mixerStore.isConnected"
                  outlined
                  input-class="text-center text-h5"
                  :rules="[val => !!val || $t('validation.required'), val => isValidMixerIp(mixerStore.ip) || $t('validation.invalidIP')]"
                  dark
                  v-model="mixerStore.ip"
                  label="Mixer IP address"
                  color="teal"
                />
              </div>
              <div class="q-gutter-sm col-12">
                <q-radio :disable="mixerStore.isConnected" v-model="mixerStore.ip" val="10.10.1.1" label="WiFi (Default)" color="teal">
                  <q-tooltip>10.10.1.1 (Default When connected to your Mixer's Wifi)</q-tooltip>
                </q-radio>
                <q-radio :disable="mixerStore.isConnected" v-model="mixerStore.ip" val="10.10.2.1" label="Wired (Default)" color="orange">
                  <q-tooltip>10.10.2.1 (Default When connected to your Mixer's ethernet port directly)</q-tooltip>
                </q-radio>
                <q-radio :disable="mixerStore.isConnected" v-model="mixerStore.ip" val="" label="Use your own" color="red">
                  <q-tooltip>If you're using an external router (Recomended), you have to set your own mixer's IP based on your router configuration</q-tooltip>
                </q-radio>
              </div>
              <div class="col-12 q-mt-sm">
                <q-separator spaced />
              </div>

              <div class="q-pa-md">{{$t('setupModal.advice')}}</div>
              <div class="col-12 col-md-12 text-center q-mt-md q-pa-md">
                <q-btn v-if="!mixerStore.isConnected" :disable="!isValidMixerIp(mixerStore.ip)" icon="mdi-connection" :label="$t('misc.connect')" @click="finishSetup" color="teal" />
                <q-btn v-else icon="mdi-connection" label="Disconnect" @click="mixerStore.uiDisconnect()" color="negative" />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="row justify-center">
            <q-btn :disable="!mixerStore.isConnected" class="col-12 col-md-6" label="Show master password" color="teal" @click="getMasterPassword">
              <q-tooltip v-if="!mixerStore.isConnected">You need to connect to your mixer first</q-tooltip>
            </q-btn>
            <div v-show="showMasterPassword" class="text-center col-12 q-my-md">Your master password is: </div>
            <div v-show="showMasterPassword" class="text-center col-12 text-bold text-h6">{{mixerStore.mixerPassword}} </div>
          </q-card-section>
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
const showMasterPassword = ref<boolean>(false)

import { isValidMixerIp } from 'src/utils/helpers';

import {useCommonStore} from 'stores/common-store';
import LanguageSwitcher from 'components/languageSwitcher.vue';

const getMasterPassword = () => {
  mixerStore.getMixerPassword()
  showMasterPassword.value = !showMasterPassword.value
}
const finishSetup = async () => {
  try {
    await mixerStore.uiConnect()
  } catch (e) {
    console.log(e)
  }
}
</script>

<template>
  <q-dialog
    v-model="mixerStore.shortcutsModal"
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="background: #343434" class="text-white">
      <q-bar style="height: 50px">
        <q-space />
        <div>
          {{$t('shortcutsModal.title')}}
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="">
        <q-card dark>
          <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="teal"
            indicator-color="teal"
            align="justify"
            narrow-indicator
          >
            <q-tab name="mutes" label="Mutes" />
            <q-tab disable name="solos" label="Solos" />
            <q-tab disable name="automation" label="Automation" />
            <q-tab disable name="automation" label="MIDI Settings" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel class="bg-dark" name="mutes">
              <div class="row justify-center items-center content-center">
                <q-btn
                  @click="mixerStore.masterMute ? mixerStore.unMuteGroup('all') : null"
                  class="q-mr-md"
                  padding="sm"
                  :color="mixerStore.masterMute ? 'red' : 'black'"
                >
                  <div class="row">
                    <div class="col-12">
                      <q-icon name="mdi-volume-high" />
                    </div>
                    <div class="col-12">
                      <span>Mute all</span>
                    </div>
                  </div>
                  <q-popup-proxy v-if="!mixerStore.masterMute">
                    <q-card>
                      <q-card-section>
                        <q-banner>
                          <template v-slot:avatar>
                            <q-icon name="mdi-alert" color="orange" />
                          </template>
                          {{$t('shortcutsModal.muteAllMsg')}}
                        </q-banner>
                      </q-card-section>
                      <q-separator class="q-my-md" />
                      <q-card-actions class="row justify-center">
                        <q-btn label="NO, cancel" v-close-popup />
                        <q-space />
                        <q-btn label="Yes! Mute All" color="orange" @click="mixerStore.muteGroup('all')" v-close-popup />
                      </q-card-actions>
                    </q-card>
                  </q-popup-proxy>
                </q-btn>
                <q-btn
                  padding="sm"
                  @click="mixerStore.muteAllFxStatus ? mixerStore.unMuteGroup('fx') : mixerStore.muteGroup('fx')"
                  :color="mixerStore.muteAllFxStatus ? 'red' : 'black'"
                >
                  <div class="row">
                    <div class="col-12">
                      <q-icon size="xs" name="mdi-alpha-f-box" />
                      <q-icon size="xs" name="mdi-alpha-x-box" />
                    </div>
                    <div class="col-12">
                      <span>Mute FX</span>
                    </div>
                  </div>
                </q-btn>
              </div>
            </q-tab-panel>

            <q-tab-panel class="bg-dark" name="solos">
              <div class="text-h6">Solos</div>
              Working on it
            </q-tab-panel>

          </q-tab-panels>
        </q-card>
      </q-card-section>
      <q-separator dark class="" />
      <q-card-actions class="row justify-center q-mb-md">
        <span class="text-center col-12 text-bold q-mt-md">My Ui Pro - v{{commonStore.version}}</span>
        <span class="text-center col-12">Made with ♥ by Josue Orozco A. | Costa Rica | Natural Cloud | @2022</span>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useMixerStore} from 'stores/mixer-store';
import {useCommonStore} from 'stores/common-store';
const commonStore = useCommonStore()
const mixerStore = useMixerStore()

const tab = ref<string>('mutes')
</script>

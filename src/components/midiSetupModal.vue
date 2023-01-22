<template>
  <q-dialog
    v-model="midiStore.midiSetupModal"
    maximized
    transition-show="slide-down"
    transition-hide="slide-up"
  >
    <q-card style="background: #343434" class="text-white">
      <q-bar style="height: 50px">
        <LanguageSwitcher />
        <q-space />
        <div>
          Soundcraft {{mixerStore.mixerInfo.model}}
        </div>
        <q-space />
        <q-btn class="q-ml-md" dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="row justify-center content-center items-center">
<!--        {{midiStore.midiUIDs}}-->
<!--        {{midiStore.currentMidiMapping}}-->
        <q-card dark class="col-12 col-md-12 row justify-center">
<!--          <q-card-section class="text-h4 col-12 text-center">-->
<!--            <div>-->
<!--              THIS SECTION IS STILL UNDER DEVELOPMENT | IT'S NOT READY YET, PLEASE DON"T USE IT.-->
<!--            </div>-->
<!--          </q-card-section>-->
          <q-card-section class="col-12 text-center">
            <div class="text-h5">MIDI Setup</div>
          </q-card-section>
          <q-card-section class="col-12 col-md-4">
            <q-list v-if="midiStore.midiDevices.length" dark bordered>
              <q-item-label header>MIDI devices</q-item-label>
              <q-separator dark />
              <q-item v-for="(device, index) in midiStore.midiDevices" :key="device.id + index" clickable @click="midiStore.selectMidiDevice(device)">
                <q-item-section avatar>
                  <q-icon color="orange" size="lg" name="mdi-midi" />
                </q-item-section>
                <q-item-section>{{device.name}}</q-item-section>
                <q-item-section side>
                  <q-item-label caption><q-icon name="mdi-midi-port" size="md" :color="midiStore.selectedDevice.id === device.id ? 'green' : 'red'" /></q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <q-separator dark spaced />
            <q-btn @click="midiStore.initMidi()" class="full-width" icon="mdi-card-search" color="teal">
              <q-tooltip class="bg-dark">Search for MIDI devices</q-tooltip>
            </q-btn>
          </q-card-section>
          <q-card-section class="col-12">
            <q-separator class="q-my-lg" dark />
          </q-card-section>
          <q-card-section v-if="!!midiStore.selectedDevice.id && mixerStore.isConnected" class="col-12 row justify-center content-center items-center">
            <q-table
              flat
              bordered
              dark
              class="col-12 z-top bg-black"
              title="MIDI Mapping"
              :rows="rows"
              :columns="columns"
              row-key="name"
              separator="cell"
            >
              <template v-slot:top>
                <span class="text-bold text-lg">MIDI Mapping</span>
                <q-space />
                <q-select disable label="MIDI Profiles" dark outlined v-model="model" :options="options">
                  <template v-slot:prepend>
                    <q-icon name="mdi-midi" />
                  </template>
                </q-select>
                <q-space />
                <q-btn disable dense color="info" icon="mdi-plus" round /> |
                <q-btn disable dense color="green" icon="mdi-content-save" round /> |
                <q-btn disable dense color="red" icon="mdi-delete" round />
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ mixerStore.channelNames[`master${props.row.id}`] || props.row.name }}
                    <br />
                    <span class="text-xs text-warning">{{mixerStore.channelNames[`master${props.row.id}`] ? `[ ${props.row.name} ]` : ''}}</span>

                  </q-td>
                  <q-td key="hiz" :props="props">
                    <q-btn round :icon="buttonIcon('hiz', props.row.id)" @click="toggleListening('hiz', props.row.id)" v-if="props.row.modules.includes('hiz')" :class="buttonColor('hiz', props.row.id)" class="full-width rounded-borders cursor-pointer">
                      <q-tooltip class="bg-black" v-if="buttonStatus('hiz', props.row.id) === 'Mapped'">
                        <p class="text-lg">
                          {{buttonStatus('hiz', props.row.id)}}
                        </p>
                        <p class="text-md">
                          {{midiStore.currentMidiMapping[`hiz${props.row.id}`].mapping}}
                        </p>
                      </q-tooltip>
                    </q-btn>
                  </q-td>
                  <q-td key="gain" :props="props">
                    <q-btn round :icon="buttonIcon('gain', props.row.id)" @click="toggleListening('gain', props.row.id)" v-if="props.row.modules.includes('gain')" :class="buttonColor('gain', props.row.id)" class="full-width rounded-borders cursor-pointer">
                      <q-tooltip class="bg-black" v-if="buttonStatus('gain', props.row.id) === 'Mapped'">
                        <p class="text-lg">
                          {{buttonStatus('gain', props.row.id)}}
                        </p>
                        <p class="text-md">
                          {{midiStore.currentMidiMapping[`gain${props.row.id}`].mapping}}
                        </p>
                      </q-tooltip>
                    </q-btn>
                  </q-td>
                  <q-td key="volume" :props="props">
                    <q-btn round :icon="buttonIcon('master', props.row.id)" @click="toggleListening('master', props.row.id)" v-if="props.row.modules.includes('volume')" :class="buttonColor('master', props.row.id)" class="full-width rounded-borders cursor-pointer">
                      <q-tooltip class="bg-black" v-if="buttonStatus('master', props.row.id) === 'Mapped'">
                        <p class="text-lg">
                          {{buttonStatus('master', props.row.id)}}
                        </p>
                        <p class="text-md">
                          {{midiStore.currentMidiMapping[`master${props.row.id}`].mapping}}
                        </p>
                      </q-tooltip>
                    </q-btn>
                  </q-td>
                  <q-td key="solo" :props="props">
                    <q-btn v-if="props.row.modules.includes('solo')" :class="buttonColor('solo', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="mute" :props="props">
                    <q-btn v-if="props.row.modules.includes('mute')" :class="buttonColor('mute', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="phantom" :props="props">
                    <q-btn v-if="props.row.modules.includes('phantom')" :class="buttonColor('phantom', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="polarity" :props="props">
                    <q-btn v-if="props.row.modules.includes('polarity')" :class="buttonColor('polarity', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="reverbFX" :props="props">
                    <q-btn v-if="props.row.modules.includes('reverbFX')" :class="buttonColor('reverbFX', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="delayFX" :props="props">
                    <q-btn v-if="props.row.modules.includes('delayFX')" :class="buttonColor('delayFX', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="chorusFX" :props="props">
                    <q-btn v-if="props.row.modules.includes('chorusFX')" :class="buttonColor('chorusFX', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="roomFX" :props="props">
                    <q-btn v-if="props.row.modules.includes('roomFX')" :class="buttonColor('roomFX',props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="pan" :props="props">
                    <q-btn v-if="props.row.modules.includes('pan')" :class="buttonColor('pan', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                  <q-td key="select" :props="props">
                    <q-btn v-if="props.row.modules.includes('select')" :class="buttonColor('select', props.row.id)" class="q-pa-md full-width q-px-lg rounded-borders cursor-pointer">
                      <span></span>
                    </q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>

          </q-card-section>
        </q-card>

      </q-card-section>
<!--      <q-card-actions class="row absolute-bottom justify-center">-->
<!--        <q-btn @click="selectChannel" label="Select channel 1" />-->
<!--        <div v-if="true" class="col-12">-->
<!--          <q-input label="Raw Message" v-model="rawMessage" />-->
<!--          <q-btn label="Send Raw Message" @click="sendRawMessage" />-->
<!--        </div>-->
<!--      </q-card-actions>-->
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {useCommonStore} from 'stores/common-store';
import {useMixerStore} from 'stores/mixer-store';
import LanguageSwitcher from 'components/languageSwitcher.vue';
import {onMounted, ref, watch} from 'vue';
import {useMidiStore} from 'stores/midi-store';
import {mixerMidiMappable} from 'src/utils/constants';
import {channel} from 'diagnostics_channel';

//

const commonStore = useCommonStore()
const mixerStore = useMixerStore()
const midiStore = useMidiStore()

const rows = ref<object[]>(mixerMidiMappable.filter((x:any) => x.devicesAllowed.includes(mixerStore.mixerInfo.model.toLowerCase())))
// const selectChannel = (channel:number) => {
//   mixerStore.conn.master.input(1).changeFaderLevelDB(0.01)
// }
watch(() => mixerStore.mixerInfo, (val:any) => {
  rows.value = mixerMidiMappable.filter((x:any) => x.devicesAllowed.includes(val.model.toLowerCase()))
}, {deep: true})

const options = [
    ''
  ]
const model = ref<any>()
const columns:any = [
  {
    name: 'name',
    required: true,
    label: 'Mixer Control',
    align: 'center',
    field: (row: any) => row.name,
    format: (val: any) => `${val}`,
  },
  { name: 'hiz', label: 'Hi-Z', field: 'hiz', align: 'center' },
  { name: 'gain', align: 'center', label: 'Gain', field: 'gain' },
  { name: 'volume', label: 'Volume', field: 'volume', align: 'center' },
  { name: 'solo', label: 'Solo', field: 'solo', align: 'center' },
  { name: 'mute', label: 'Mute', field: 'mute', align: 'center' },
  { name: 'phantom', label: 'Phantom', field: 'phantom', align: 'center'},
  { name: 'polarity', label: 'Polarity', field: 'polarity', align: 'center' },
  { name: 'reverbFX', label: 'Reverb FX', field: 'reverbFX', align: 'center' },
  { name: 'delayFX', label: 'Delay FX', field: 'delayFX', align: 'center' },
  { name: 'chorusFX', label: 'Chorus FX', field: 'chorusFX', align: 'center' },
  { name: 'roomFX', label: 'Room FX', field: 'roomFX', align: 'center' },
  { name: 'pan', label: 'Pan', field: 'pan', align: 'center' },
  // { name: 'select', label: 'Select', field: 'select', align: 'center' },
]

const buttonStatus = (type: string, id:string) => {
  const target = type + id

  switch (true) {
    case midiStore.currentlyListeningTo === target:
      return 'Listening'
    case !!midiStore.currentMidiMapping[target] && !!midiStore.currentMidiMapping[target].uid:
      return 'Mapped'
    default:
      return 'Unassigned'
  }
}

const buttonColor = (type:string, id:string) => {

  switch (buttonStatus(type, id)) {
    case 'Listening':
      return 'bg-red'
    case 'Mapped':
      return 'bg-green'
    default:
      return 'bg-dark'
  }
}

const buttonIcon = (type:string, id:string) => {
  switch (buttonStatus(type, id)) {
    case 'Listening':
      return 'mdi-access-point'
    case 'Mapped':
      return 'mdi-midi-port'
    default:
      return 'mdi-set-none'
  }
}

const rawMessage = ref<string>('')
const sendRawMessage = () => {
  console.log(rawMessage.value)
  mixerStore.conn.conn.sendMessage(rawMessage.value)
}
const toggleListening = (type: string, id: string) => {
  const target = type + id
  console.log(target)
  midiStore.currentlyListeningTo === target ?
    midiStore.currentlyListeningTo = null :
    midiStore.currentlyListeningTo = target
}
onMounted(() => {
  midiStore.initMidi()
})
//
// watch(() => mixerStore.curr, (val: any) => {
//   //
// }, {deep: true})

</script>

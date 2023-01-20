import { defineStore } from 'pinia';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {WebMidi} from '/node_modules/webmidi/dist/esm/webmidi.esm.min.js';
import { Notify } from 'quasar'
import {dbToVelocity, velocityToDb, velocityToToggle} from 'src/utils/helpers';
import {useMixerStore} from 'stores/mixer-store';
export const useMidiStore = defineStore('midiStore', {
  state: () => ({
    currentlyListeningTo: <string | null> null,
    midiSetupModal: <boolean>false,
    selectedDevice: <any>{},
    midiProfiles: [],
    currentMidiMapping: <any>{
      masterVolume: {
        uid: null,
        mapping: null,
      },
      masterInput0: {
        number: 0,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput0: {
        number: 0,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      hizInput0: {
        number: 0,
        type: 'hiz',
        uid: null,
        mapping: null,
      },

      masterInput1: {
        number: 1,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput1: {
        number: 1,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },
      hizInput1: {
        number: 1,
        type: 'hiz',
        uid: null,
        mapping: null,
      },

      masterInput2: {
        number: 2,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput2: {
        number: 2,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput3: {
        number: 3,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput3: {
        number: 3,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput4: {
        number: 4,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput4: {
        number: 4,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput5: {
        number: 5,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput5: {
        number: 5,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput6: {
        number: 6,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput6: {
        number: 6,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput7: {
        number: 7,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput7: {
        number: 7,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput8: {
        number: 8,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput8: {
        number: 8,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput9: {
        number: 9,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput9: {
        number: 9,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput10: {
        number: 10,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput10: {
        number: 10,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput11: {
        number: 11,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput11: {
        number: 11,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput12: {
        number: 12,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput12: {
        number: 12,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput13: {
        number: 13,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput13: {
        number: 13,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput14: {
        number: 14,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput14: {
        number: 14,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput15: {
        number: 15,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput15: {
        number: 15,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },

      masterInput16: {
        number: 16,
        type: 'input',
        dbType: 'level',
        uid: null,
        mapping: null,
      },
      gainInput16: {
        number: 16,
        type: 'gain',
        dbType: 'gain',
        uid: null,
        mapping: null,
      },
    },
    activeInput: <boolean>false,
    midiDevices: <Array<object>> []
  }),
  getters: {
    inputUIDs: state => {
      return Object.values(state.currentMidiMapping)
        .filter((x:any) => x.uid !== null && ['input', 'gain'].includes(x.type))
        .map((x:any) => x.uid);
    },
    hizUIDs: state => {
      return Object.values(state.currentMidiMapping)
        .filter((x:any) => x.uid !== null && x.type === 'hiz')
        .map((x:any) => x.uid);
    },
  },
  actions: {
    findObjectByUID (obj:any, targetUID:any) {
      for (const key in obj) {
        if (obj[key].uid === targetUID) {
          return obj[key];
        }
      }
      return null;
    },
    async initMidi() {
      await WebMidi
        .enable()
        .then(this.getDevices)
        .catch((err: any) => {
          console.log(err)
        });
    },
    async getDevices () {
      this.midiDevices.splice(0, this.midiDevices.length)
      // Inputs
      await WebMidi.inputs.forEach((input:any) => {
        this.midiDevices.push({name: input.name, manufacturer: input.manufacturer, id: input.id})
      });

      const device = Object.entries(this.selectedDevice).length
      if (device) {
        this.selectMidiDevice(this.selectedDevice)
      }

      // Inputs
      // WebMidi.inputs.forEach((input: { manufacturer: any; name: any; }) => console.log(input.manufacturer, input.name));

      // Outputs
      // WebMidi.outputs.forEach((output: { manufacturer: any; name: any; }) => console.log(output.manufacturer, output.name));
    },
    selectMidiDevice(device:any) {
      this.selectedDevice = device
      Notify.create({message: `Connected to ${this.selectedDevice.name}`})

      if (this.midiDevices.some((x:any) => x.id === device.id)){
        this.listenForMidiMessages(this.selectedDevice.id)
        Notify.create({message: `Listening MIDI messages from ${this.selectedDevice.name}`})
      }
    },
    getMidiMessageId(midi: WebMidi.MIDIMessage) {
      return `Type:${midi.message.statusByte}|Channel:${midi.message.channel}|Controller:${midi.message.data[1]}`;
    },
    sendMidiMessage(db:number, type:string, inputNumber: number | null = null) {
      switch (type) {
        case 'masterVolume':
          const masterChannel = this.currentMidiMapping.masterVolume.mapping.channel
          const masterController = this.currentMidiMapping.masterVolume.mapping.controller
          const masterOutput = WebMidi.getOutputByName(this.selectedDevice.name)
          masterOutput.channels[masterChannel].sendControlChange(masterController, dbToVelocity(db, 'level'))
          break
        case 'masterInput':
          const inputChannel = this.currentMidiMapping[`masterInput${inputNumber}`].mapping.channel
          const inputController = this.currentMidiMapping[`masterInput${inputNumber}`].mapping.controller
          const inputOutput = WebMidi.getOutputByName(this.selectedDevice.name)
          inputOutput.channels[inputChannel].sendControlChange(inputController, dbToVelocity(db, 'level'))
          break
        case 'gainInput':
          const gainInputChannel = this.currentMidiMapping[`masterInput${inputNumber}`].mapping.channel
          const gainInputController = this.currentMidiMapping[`masterInput${inputNumber}`].mapping.controller
          const gainInputOutput = WebMidi.getOutputByName(this.selectedDevice.name)
          gainInputOutput.channels[gainInputChannel].sendControlChange(gainInputController, dbToVelocity(db, 'gain'))
          break
        default:
          //
      }
    },
    listenForMidiMessages(deviceID:string) {
      const mixerStore = useMixerStore()
      if (WebMidi.inputs.length && WebMidi.inputs.some((x:any) => x.id === deviceID)){
        WebMidi.getInputById(deviceID).addListener("midimessage", (e:any) => {
          const velocity = e.data[2]
          //Set the mapping for each control
          if (this.currentlyListeningTo) {
            this.currentMidiMapping[this.currentlyListeningTo].mapping = {
              channel: e.message.channel,
              command: e.message.command,
              controller: e.data[1],
            }
            this.currentMidiMapping[this.currentlyListeningTo].uid = this.getMidiMessageId(e)
            this.currentlyListeningTo = null
          }
          this.activeInput = true
          switch (true) {
            //Master Level
            case this.getMidiMessageId(e) === this.currentMidiMapping.masterVolume.uid:
              mixerStore.setFaderLevel(velocityToDb(velocity, 'level'), 'master')
              this.activeInput = false
              break
            //Any Input Level
            case this.inputUIDs.includes(this.getMidiMessageId(e)):
              const inputControl = this.findObjectByUID(this.currentMidiMapping, this.getMidiMessageId(e))
              // console.log(inputControl)
              // console.log(this.getMidiMessageId(e))
              mixerStore.setFaderLevel(velocityToDb(velocity, inputControl.dbType), inputControl.type, inputControl.number)
              this.activeInput = false
              break
            case this.hizUIDs.includes(this.getMidiMessageId(e)):
              const hizInputControl = this.findObjectByUID(this.currentMidiMapping, this.getMidiMessageId(e))
              mixerStore.setToggle(velocityToToggle[velocity], hizInputControl.type, hizInputControl.number)
              this.activeInput = false
            default:
              console.log(this.getMidiMessageId(e))
          }

        });
      }
    },
    initSavedMidiDevice() {
      if (this.selectedDevice.id){
        console.log(this.selectedDevice.id)
        this.initMidi().then(() => this.listenForMidiMessages(this.selectedDevice.id))
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['selectedDevice', 'midiProfiles', 'currentMidiMapping']
  },
});

import { defineStore } from 'pinia';
import { SoundcraftUI } from 'soundcraft-ui-connection';
import {DBToGainValue, dbToVelocity, gainValueToDB, isAllowedURL, isValidMixerIp, reload} from 'src/utils/helpers';
import { map, filter, first } from 'rxjs/operators'
import {useMidiStore} from 'stores/midi-store';
import {gainMessages} from 'src/utils/constants';
export const useMixerStore = defineStore('mixerStore', {
  state: () => ({
    isDemoMode: <boolean>false,
    analogUi16Modal: <boolean>true,
    setupModal: <boolean> false,
    shortcutsModal: <boolean> false,
    showPlayerControls: <boolean> false,
    layoutsEditModal: <boolean> true,
    conn: <any> null,
    connStatus: '',
    mixerModel: '',
    mixerPassword: '',
    mixerInfo: {
      model: '',
      firmware: '',
    },
    layout: <string|number>1,
    ip: '',
    channelNames: <any>{},
    mixerSettings: {
      muteGroups: {
        master: false,
        fx: false,
        grp1: false,
        grp2: false,
      },
      player: {
        playlists: [],
        currentState: 0,
        currentPlaylist: '',
        currentTrack: '',
        currentLength: <number>0,
        currentElapsedTime: <number>0,
        currentRemainingTime: <number>0,
        currentShuffleStatus: null,
      },
      recorder: {
        dualTrack: {
          isRecording: false,
          isBusy: false,
        }
      }
    }
  }),
  getters: {
    isConnected: (state) => state.connStatus === 'OPEN',
    mixerSrc: (state) => state.isDemoMode ? state.ip : `http://${state.ip}/mixer.html?ID`,
    masterMute: state => state.mixerSettings.muteGroups.master,
    muteAllFxStatus: state => state.mixerSettings.muteGroups.fx,
    currentElapsedTime: state => {
      const secondsToTime = (e:any) => {
        const h = Math.floor(e / 3600).toString().padStart(2,'0'),
          m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
          s = Math.floor(e % 60).toString().padStart(2,'0');

        return h + ':' + m + ':' + s;
      }
      return secondsToTime(state.mixerSettings.player.currentElapsedTime)
    }
  },
  actions: {
    getUiModel() {
      const model$ = this.conn.store.state$.pipe(
        map((state:any) => state.model),
        filter(e => !!e),
        first()
      );
      model$.subscribe((val:string) => {
        this.mixerInfo.model = val.toUpperCase()
      })
    },
    getPlayerPlaylist() {
      const playlists$ = this.conn.conn.allMessages$.pipe(
        map((state:any) => state),
        filter((e:any) => !!e && e.substring(0, 7) === 'PLISTS^'),
        first()
      );

      playlists$.subscribe((val:any) => {
        console.log(val)
      })

    },
    getMixerPassword() {
      // this.conn.store.state$.subscribe((val:any) => {
      //   console.log(val['settings.block.pass'])
      // })
      const password$ = this.conn.store.state$.pipe(
        map((state:any) => state['settings.block.pass']),
        filter(e => !!e),
        first()
      );
      password$.subscribe((val:string) => {
        this.mixerPassword = val
      })
    },
    getFirmwareVersion() {
      const firmware$ = this.conn.store.state$.pipe(
        map((state:any) => state.firmware),
        filter(e => !!e),
        first()
      );
      firmware$.subscribe((val:string) => {
        this.mixerInfo.firmware = val
      })
    },
    async uiConnect() {
      if (isValidMixerIp(this.ip)){
        if (isAllowedURL(this.ip)){
          this.isDemoMode = true
        }else {
          this.isDemoMode = false
          this.conn = new SoundcraftUI(this.ip)
          this.conn.status$.subscribe((status:any) => {
            this.connStatus = status.type
          });
          await this.conn.connect()
          this.getUiModel()
          this.getFirmwareVersion()
        }
      }else {
        this.setupModal = true
      }

    },
    uiDisconnect() {
      if (!this.isDemoMode){
        this.conn.disconnect()
      }
      this.ip = '';
      this.mixerModel = '';
      this.setupModal = true
      reload(true)
    },
    muteGroup(type:string) {
      this.conn.muteGroup(type).mute()
    },
    unMuteGroup(type:string) {
      this.conn.muteGroup(type).unmute()
    },

    setFaderLevel(dbValue: number, type:string, channel:number|null = null) {
      switch (type) {
        case 'master':
          this.conn.master.setFaderLevelDB(dbValue)
          break
        case 'input':
          this.conn.master.input(channel! + 1).setFaderLevelDB(dbValue)
          break
        case 'gain':
          if (this.mixerInfo.model === 'UI24'){
            this.conn.hw(channel! + 1).setGainDB(dbValue)
          }else {
            // console.log(dbValue)
            //Workaround for Ui12 & Ui16
            this.conn.conn.sendMessage(`SETD^i.${channel}.gain^${DBToGainValue(dbValue)}`)
          }
          break
        default:
          return null
      }
    },
    setToggle(value:number, type:string, channel:number|null = null) {
      switch (type) {
        case 'hiz':
          console.log('got here')
          console.log(value)
          this.conn.conn.sendMessage(`SETD^i.${channel}.hiz^${value}`)
          break
        default:
          return null
      }
    },

    playerActions(action: string) {
      switch (true) {
        case action === 'play':
          return this.conn.player.play()
        case action === 'pause':
          return this.conn.player.pause()
        case action === 'stop':
          return this.conn.player.stop()
        case action === 'next':
          return this.conn.player.next()
        case action === 'prev':
          return this.conn.player.prev()
        case action === 'shuffle':
          return this.conn.player.toggleShuffle()
        default:
          //
      }
    },
    dualTrackRecordToggle() {
      this.conn.recorderDualTrack.recordToggle()
    },

    async listeners() {
      const midiStore = useMidiStore()
      // this.getRawStream()
      // Master Fader Level DB
      if (midiStore.currentMidiMapping.masterVolume.mapping){
        this.conn.master.faderLevelDB$.subscribe((value:any) => {
          midiStore.sendMidiMessage(value, 'masterVolume')
        });
      }
      if (midiStore.inputUIDs.length){
        for (let i = 0; i < midiStore.inputUIDs.length; i++){
          const target = midiStore.findObjectByUID(midiStore.currentMidiMapping, midiStore.inputUIDs[i])

          if (target.type === 'input'){
            this.conn.master.input(target.number + 1).faderLevelDB$.subscribe((value:any) => {
              if (!midiStore.activeInput) midiStore.sendMidiMessage(value, 'masterInput', target.number)
            })
          }

          if (target.type === 'gain'){
            if (this.mixerInfo.model === 'UI24'){
              this.conn.hw(target.number + 1).gainDB$.subscribe((value:any) => {
                // console.log('gain', value, target)
                if (!midiStore.activeInput) midiStore.sendMidiMessage(value, 'gainInput', target.number)
              })
            }else {
              // const gain$ = this.conn.conn.allMessages$.pipe(
              //   map((state:any) => state),
              //   filter((e:any) => gainMessages.includes(e.substring(0, 14)) || gainMessages.includes(e.substring(0, 15))),
              //   // first()
              // );
              //
              // gain$.subscribe((val:any) => {
              //   midiStore.sendMidiMessage(dbToVelocity(gainValueToDB(val), 'gain'), 'gainInput', target.number)
              // })
            }
          }
        }
      }

      // if (midiStore.currentMidiMapping.masterInput0.mapping){
      //   this.conn.master.input(1).faderLevelDB$.subscribe((value:any) => {
      //     midiStore.sendMidiMessage(value, 'masterInput', 0)
      //   });
      // }


      // this.conn.master.input(1).name$.subscribe((val:string) => {
      //   this.channelNames.masterInput1 = val
      // })

      const inputNames$ = this.conn.store.state$.pipe(
        map((state:any) => Object.entries(state)
          .filter(([key]) => key.startsWith('i.') && key.endsWith('.name'))
          .map(([key, value]) => ({
            name: value,
            number: key.split('.')[1],
          }))
        ),
        filter(name => !!name)
      );

      inputNames$.subscribe((val:string[]) => {
        // console.log(val)
        val.forEach((input:any) => {
          this.channelNames[`masterInput${input.number}`] = input.name
        })
      })

      //Master Mute
      this.conn.muteGroup('all').state$.subscribe((value:number) => {
        this.mixerSettings.muteGroups.master = value === 1
      })
      //Mute FX
      this.conn.muteGroup('fx').state$.subscribe((value:number) => {
        this.mixerSettings.muteGroups.fx = value === 1
      })

      //Get Player State
      this.conn.player.state$.subscribe((value:number) => {
        this.mixerSettings.player.currentState = value
      })
      this.conn.player.playlist$.subscribe((value: string) => {
        this.mixerSettings.player.currentPlaylist = value
      })
      this.conn.player.track$.subscribe((value:string) => {
        this.mixerSettings.player.currentTrack = value
      })
      this.conn.player.length$.subscribe((value:number) => {
        this.mixerSettings.player.currentLength = value
      })
      this.conn.player.elapsedTime$.subscribe((value:number) => {
        this.mixerSettings.player.currentElapsedTime = value
      })
      this.conn.player.remainingTime$.subscribe((value:number) => {
        this.mixerSettings.player.currentRemainingTime = value
      })

      //Recorder
      this.conn.recorderDualTrack.recording$.subscribe((value:number) => {
        this.mixerSettings.recorder.dualTrack.isRecording = value === 1
      })
      this.conn.recorderDualTrack.busy$.subscribe((value:number) => {
        this.mixerSettings.recorder.dualTrack.isBusy = value === 1
      })
    }
  },
  persist: {
    storage: localStorage,
    paths: ['ip', 'layout'],
  },
});

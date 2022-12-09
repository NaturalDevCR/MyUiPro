import { defineStore } from 'pinia';
import { SoundcraftUI } from 'soundcraft-ui-connection';
import {isAllowedURL, isValidMixerIp, reload} from 'src/utils/helpers';
import { map, filter, first } from 'rxjs/operators'
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

    mixerSettings: {
      muteGroups: {
        master: false,
        fx: false,
        grp1: false,
        grp2: false,
      },
      player: {
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
    getMixerPassword() {
      const password$ = this.conn.store.state$.pipe(
        map((state:any) => state.settings.block.pass),
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
    uiConnect() {
      if (isValidMixerIp(this.ip)){
        if (isAllowedURL(this.ip)){
          this.isDemoMode = true
        }else {
          this.isDemoMode = false
          this.conn = new SoundcraftUI(this.ip)
          this.conn.status$.subscribe((status:any) => {
            this.connStatus = status.type
          });
          this.conn.connect()
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
      // reload(true)
    },
    muteGroup(type:string) {
      this.conn.muteGroup(type).mute()
    },
    unMuteGroup(type:string) {
      this.conn.muteGroup(type).unmute()
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
      // this.getRawStream()
      //Master Fader Level DB
      // this.conn.master.faderLevelDB$.subscribe((value:any) => {
      //   console.log(value)
      // });
      // this.conn.store.messages$.subscribe((val:any) => {
      //   // console.log(val)
      // })

      // this.conn.store.conn.allMessages$.subscribe((val:any) => {
      //   const msg = val.substring(0, 5)
      //   const ignoreMsgs = ['VU2^D', 'RTA^A', 'SETD^', 'SETS^']
      //   if (!ignoreMsgs.includes(msg)){
      //     console.log(val)
      //   }
      //
      // })

      // this.conn.store.state$.subscribe((value:any) => {
      //   if (!this.mixerModel){
      //     this.mixerModel = value.model
      //   }
      // })

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
    enabled: true,
    strategies: [
      {
        key: 'mixerStorage',
        storage: localStorage,
        paths: ['ip', 'mixerModel', 'layout'],
      },
    ],
  },
});

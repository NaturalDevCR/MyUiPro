import { defineStore } from 'pinia';
import { SoundcraftUI } from 'soundcraft-ui-connection';
import {isIPv4} from 'is-ip';

export const useMixerStore = defineStore('mixerStore', {
  state: () => ({
    analogUi16Modal: <boolean>true,
    setupModal: <boolean> false,
    shortcutsModal: <boolean> false,
    showPlayerControls: <boolean> false,
    layoutsEditModal: <boolean> true,
    conn: <any> null,
    connStatus: '',
    mixerModel: '',
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
    mixerSrc: (state) => `http://${state.ip}/mixer.html?ID`,
    masterMute: state => state.mixerSettings.muteGroups.master,
    muteAllFxStatus: state => state.mixerSettings.muteGroups.fx
  },
  actions: {
    uiConnect() {
      if (isIPv4(this.ip) && this.mixerModel){
        this.conn = new SoundcraftUI(this.ip)
        this.conn.status$.subscribe((status:any) => {
          this.connStatus = status.type
          // console.log(status)
        });
        this.conn.connect()
      }else {
        this.setupModal = true
      }

    },
    uiDisconnect() {
      this.conn.disconnect()
      this.ip = '';
      this.mixerModel = '';
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    },
    muteGroup(type:string) {
      this.conn.muteGroup(type).mute()
    },
    unMuteGroup(type:string) {
      this.conn.muteGroup(type).unmute()
    },
    playerActions(action: string, param = '') {
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
      //Master Fader Level DB
      this.conn.master.faderLevelDB$.subscribe((value:any) => {
        console.log(value)
      });

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

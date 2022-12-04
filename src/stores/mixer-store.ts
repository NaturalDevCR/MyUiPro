import { defineStore } from 'pinia';
import { SoundcraftUI } from 'soundcraft-ui-connection';
import {isIPv4} from 'is-ip';
export const useMixerStore = defineStore('mixerStore', {
  state: () => ({
    analogUi16Modal: <boolean>true,
    setupModal: <boolean> false,
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
      }
    }
  }),
  getters: {
    mixerSrc: (state) => `http://${state.ip}/mixer.html?ID`,
    masterMute: state => state.mixerSettings.muteGroups.master
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

    async listeners() {
      //Master Fader Level DB
      this.conn.master.faderLevelDB$.subscribe((value:any) => {
        console.log(value)
      });

      //Master Mute
      this.conn.muteGroup('all').state$.subscribe((value:number) => {
        this.mixerSettings.muteGroups.master = value === 1
      })
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'mixerStorage',
        storage: localStorage,
        paths: ['ip', 'mixerModel'],
      },
    ],
  },
});

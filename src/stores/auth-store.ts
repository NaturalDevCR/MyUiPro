import { defineStore } from 'pinia';
// import { Notify } from 'quasar'
import { map, filter, first } from 'rxjs/operators'
import {useMixerStore} from 'stores/mixer-store';
export const useAuthStore = defineStore('midiStore', {
  state: () => ({
    isAuthenticated: <boolean>false,
    requestPasswordModal: <boolean> false,
  }),
  getters: {
    //
  },
  actions: {
    checkPassword(pass:string) {
      this.isAuthenticated = this.getMixerPassword() === pass;
    },
    getMixerPassword() {
      const mixerStore = useMixerStore()
      const password$ = mixerStore.conn.store.state$.pipe(
        map((state:any) => state.settings.block.pass),
        filter(e => !!e),
        first()
      );
      let currentPassword
      password$.subscribe((val:string) => {
        currentPassword = val
      })

      return currentPassword
    },
  },
  persist: {
    storage: localStorage,
    paths: ['isAuthenticated'],
  },
});

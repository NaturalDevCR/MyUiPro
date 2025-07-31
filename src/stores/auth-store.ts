import { defineStore } from 'pinia';
// import { Notify } from 'quasar'
import { map, filter, first } from 'rxjs/operators';
import { useMixerStore } from 'stores/mixer-store';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: <boolean>false,
    requestPasswordModal: <boolean>false,
  }),
  getters: {
    //
  },
  actions: {
    /**
     * Get mixer password from mixer store
     * @returns Current mixer password
     */
    getMixerPassword() {
      const mixerStore = useMixerStore();
      if (!mixerStore.conn) {
        return '';
      }
      const password$ = mixerStore.conn.store.state$.pipe(
        map((state: any) => state.settings.block.pass),
        filter((e) => !!e),
        first(),
      );
      let currentPassword;
      password$.subscribe((val: string) => {
        currentPassword = val;
      });

      return currentPassword;
    },
    /**
     * Check if provided password matches mixer password
     * @param pass - Password to check
     */
    checkPassword(pass: string) {
      this.isAuthenticated = this.getMixerPassword() === pass;
    },
  },
  persist: [
    {
      key: 'authStore',
      pick: ['isAuthenticated'],
      storage: localStorage,
    },
  ],
});

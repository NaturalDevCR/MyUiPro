import { defineStore } from 'pinia';
import { map, filter, first } from 'rxjs/operators';
import { useMixerStore } from 'stores/mixer-store';
import type { Subscription } from 'rxjs';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false as boolean,
    requestPasswordModal: false as boolean,
    // Agregar gestión de subscripción
    passwordSubscription: null as Subscription | null,
  }),
  getters: {
    //
  },
  actions: {
    /**
     * Get mixer password from mixer store
     * @returns Current mixer password
     */
    getMixerPassword(): string {
      try {
        const mixerStore = useMixerStore();
        if (!mixerStore.conn) {
          console.warn('No mixer connection available');
          return '';
        }

        const password$ = mixerStore.conn.store.state$.pipe(
          map((state: any) => state.settings.block.pass),
          filter((e) => !!e),
          first(),
        );

        let currentPassword = '';
        
        // Limpiar subscripción anterior si existe
        if (this.passwordSubscription && !this.passwordSubscription.closed) {
          this.passwordSubscription.unsubscribe();
        }

        this.passwordSubscription = password$.subscribe({
          next: (val: string) => {
            currentPassword = val;
          },
          error: (error) => {
            console.error('Error getting mixer password:', error);
            currentPassword = '';
          },
          complete: () => {
            // Limpiar subscripción al completarse
            this.passwordSubscription = null;
          }
        });

        return currentPassword;
      } catch (error) {
        console.error('Error in getMixerPassword:', error);
        return '';
      }
    },

    /**
     * Check if provided password matches mixer password
     * @param pass - Password to check
     */
    checkPassword(pass: string): void {
      try {
        const mixerPassword = this.getMixerPassword();
        this.isAuthenticated = mixerPassword === pass;
      } catch (error) {
        console.error('Error checking password:', error);
        this.isAuthenticated = false;
      }
    },

    /**
     * Cleanup subscriptions
     */
    cleanup(): void {
      if (this.passwordSubscription && !this.passwordSubscription.closed) {
        this.passwordSubscription.unsubscribe();
        this.passwordSubscription = null;
      }
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

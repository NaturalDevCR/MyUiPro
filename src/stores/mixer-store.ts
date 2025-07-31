import { defineStore } from 'pinia';
import { SoundcraftUI, ConnectionStatus } from 'soundcraft-ui-connection';
import type { MuteGroupID } from 'soundcraft-ui-connection';
import { DBToGainValue, isAllowedURL, isValidMixerIp, reload } from 'src/utils/helpers';
import { map, filter, first } from 'rxjs/operators';
import { visibilityManager } from '../utils/visibility-manager';
import { Loading, Notify } from 'quasar';
import type { Subscription } from 'rxjs';

// Interfaces para mejorar el tipado
interface MixerInfo {
  model: string;
  firmware: string;
}

interface MuteGroups {
  master: boolean;
  fx: boolean;
  grp1: boolean;
  grp2: boolean;
}

interface PlayerSettings {
  playlists: string[];
  currentState: number;
  currentPlaylist: string;
  currentTrack: string;
  currentLength: number;
  currentElapsedTime: number;
  currentRemainingTime: number;
  currentShuffleStatus: boolean | null;
}

interface RecorderSettings {
  dualTrack: {
    isRecording: boolean;
    isBusy: boolean;
  };
}

interface MixerSettings {
  muteGroups: MuteGroups;
  player: PlayerSettings;
  recorder: RecorderSettings;
}

interface ChannelNames {
  [key: string]: string;
}

interface ConnectionStatusEvent {
  type: ConnectionStatus;
  message?: string;
}

interface InputNameData {
  name: string;
  number: string;
}

export const useMixerStore = defineStore('mixerStore', {
  state: () => ({
    reconnectionCounter: 0,
    isDemoMode: false as boolean,
    analogUi16Modal: true as boolean,
    setupModal: false as boolean,
    shortcutsModal: false as boolean,
    showPlayerControls: false as boolean,
    conn: null as SoundcraftUI | null,
    connStatus: ConnectionStatus.Close as ConnectionStatus, // Cambiar de string a ConnectionStatus
    mixerModel: '' as string,
    mixerPassword: '' as string,
    mixerInfo: {
      model: '',
      firmware: '',
    } as MixerInfo,
    ip: '' as string,
    channelNames: {} as ChannelNames,
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
        currentLength: 0,
        currentElapsedTime: 0,
        currentRemainingTime: 0,
        currentShuffleStatus: null,
      },
      recorder: {
        dualTrack: {
          isRecording: false,
          isBusy: false,
        },
      },
    } as MixerSettings,
    // New visibility and reconnection state
    isPageVisible: true,
    reconnectAttempts: 0,
    maxReconnectAttempts: 3,
    lastConnectionTime: 0,
    connectionCheckInterval: null as NodeJS.Timeout | null,
    backgroundUpdateInterval: null as NodeJS.Timeout | null,
    visibilityCallbackRegistered: false,
    // Add missing subscription properties
    vuSubscription: null as Subscription | null,
    playerTimeSubscription: null as Subscription | null,
  }),
  getters: {
    isConnected: (state) => state.connStatus === ConnectionStatus.Open, // Ahora la comparación es type-safe
    mixerSrc: (state) => (state.isDemoMode ? state.ip : `http://${state.ip}/mixer.html?ID`),
    masterMute: (state) => state.mixerSettings.muteGroups.master,
    muteAllFxStatus: (state) => state.mixerSettings.muteGroups.fx,
    currentElapsedTime: (state) => {
      const secondsToTime = (seconds: number): string => {
        const h = Math.floor(seconds / 3600)
            .toString()
            .padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const s = Math.floor(seconds % 60)
            .toString()
            .padStart(2, '0');
        return `${h}:${m}:${s}`;
      };
      return secondsToTime(state.mixerSettings.player.currentElapsedTime);
    },
    /**
     * Check if connection is stale (older than 30 seconds)
     */
    isConnectionStale(): boolean {
      return this.lastConnectionTime > 0 && Date.now() - this.lastConnectionTime > 30000;
    },
  },
  actions: {
    /**
     * Initialize visibility manager and handle page visibility changes
     */
    initVisibilityManager(): void {
      if (this.visibilityCallbackRegistered) {
        return; // Already registered
      }

      visibilityManager.onVisibilityChange((visible) => {
        this.isPageVisible = visible;

        if (visible) {
          void this.handlePageVisible();
        } else {
          this.handlePageHidden();
        }
      });

      this.visibilityCallbackRegistered = true;
    },

    /**
     * Restore all listeners after page becomes visible
     */
    restoreAllListeners(): void {
      if (!this.conn || !this.isConnected) {
        return;
      }

      console.log('Restoring all listeners...');

      // Restore VU meter subscriptions if they were paused
      if (!this.vuSubscription && this.conn.master) {
        // Example: restore VU meter subscription
        // this.vuSubscription = this.conn.master.vu$.subscribe(...);
      }

      // Restore player time subscription if it was paused
      if (!this.playerTimeSubscription && this.conn.player) {
        this.playerTimeSubscription = this.conn.player.elapsedTime$.subscribe((value: number) => {
          this.mixerSettings.player.currentElapsedTime = value;
        });
      }

      // Ensure all other listeners are active
      this.listeners();
    },

    /**
     * Handle when page becomes visible
     */
    // En handlePageVisible (línea 195)
    async handlePageVisible(): Promise<void> {
      console.log('Page became visible, checking connections...');

      // Reset reconnect attempts
      this.reconnectAttempts = 0;

      // Clear any existing intervals
      if (this.connectionCheckInterval) {
        clearInterval(this.connectionCheckInterval);
        this.connectionCheckInterval = null;
      }

      if (this.backgroundUpdateInterval) {
        clearInterval(this.backgroundUpdateInterval);
        this.backgroundUpdateInterval = null;
      }

      // AGREGAR: Verificación de modo demo
      if (this.isDemoMode) {
        console.log('Demo mode active, skipping connection verification');
        this.restoreAllListeners();
        return;
      }

      try {
        // NEW: Verificar si la conexión está realmente activa
        const isConnectionHealthy = await this.verifyConnectionHealth();

        if (!isConnectionHealthy) {
          console.log('Connection unhealthy, forcing reconnection...');
          await this.forceReconnection();
        }

        // Restaurar todos los listeners
        this.restoreAllListeners();

        // Verificar y restaurar conexiones si es necesario
        await this.verifyConnections();
      } catch (error) {
        console.error('Error in handlePageVisible:', error);
        // En caso de error, forzar reconexión completa
        await this.forceReconnection();
      }

      // Start periodic connection checks
      this.startConnectionMonitoring();
    },

    // Nuevo método para verificar salud de conexión
    async verifyConnectionHealth(): Promise<boolean> {

      // AGREGAR: Verificación de modo demo
      if (this.isDemoMode) {
        console.log('Demo mode active, skipping connection health check');
        return true; // En demo mode, siempre "saludable"
      }
      if (!this.conn || !this.isConnected) {
        return false;
      }

      try {
        // Enviar un ping simple para verificar que la conexión responde
        return new Promise((resolve) => {
          const timeout = setTimeout(() => resolve(false), 5000);

          // Usar un observable que responda rápidamente
          const subscription = this.conn!.store.state$.pipe(first()).subscribe(() => {
            clearTimeout(timeout);
            subscription.unsubscribe();
            resolve(true);
          });
        });
      } catch (error) {
        console.error('Connection health check failed:', error);
        return false;
      }
    },

    // Método para forzar reconexión completa
    async forceReconnection(): Promise<void> {
      console.log('Forcing complete reconnection...');

      if (this.isDemoMode) {
        console.log('Demo mode active, skipping force reconnection');
        return;
      }

      try {
        // Desconectar completamente
        await this.uiDisconnect(false);

        // Esperar un momento antes de reconectar
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Reconectar
        await this.uiConnect();
      } catch (error) {
        console.error('Force reconnection failed:', error);
        throw error;
      }
    },

    /**
     * Handle when page becomes hidden
     */
    // En handlePageHidden, agregar más limpieza de recursos
    handlePageHidden(): void {
      console.log('Page became hidden, reducing activity...');

      // Stop connection monitoring to save resources
      if (this.connectionCheckInterval) {
        clearInterval(this.connectionCheckInterval);
        this.connectionCheckInterval = null;
      }

      // Clear any pending reconnection attempts
      visibilityManager.clearReconnectTimeouts();

      // NEW: Pause non-essential subscriptions
      this.pauseNonEssentialListeners();

      // NEW: Reduce update frequency for essential listeners
      this.reduceUpdateFrequency();
    },

    // Nuevos métodos para optimizar recursos
    pauseNonEssentialListeners(): void {
    // Pausar listeners de VU meters, que consumen muchos recursos
    if (this.vuSubscription) {
      this.vuSubscription.unsubscribe();
      this.vuSubscription = null;
    }

    // Pausar actualizaciones de tiempo del player
    if (this.playerTimeSubscription) {
      this.playerTimeSubscription.unsubscribe();
      this.playerTimeSubscription = null;
    }
    },

    /**
     * Reduce update frequency for background operation
     */
    reduceUpdateFrequency(): void {
      // Clear existing interval if any
      if (this.backgroundUpdateInterval) {
        clearInterval(this.backgroundUpdateInterval);
      }

      // Change to less frequent updates for essential data
      this.backgroundUpdateInterval = setInterval(() => {
        if (!this.isPageVisible && this.isConnected) {
          // Only verify connection health every 30 seconds in background
          void this.verifyConnectionHealth();
        }
      }, 30000);
    },

    /**
     * Start monitoring connection health
     */
    startConnectionMonitoring(): void {
      if (this.connectionCheckInterval) {
        clearInterval(this.connectionCheckInterval);
      }

      this.connectionCheckInterval = setInterval(() => {
        if (this.isPageVisible && this.ip && !this.isDemoMode) {
          // Use void operator to explicitly ignore the promise
          void this.verifyConnections();
        }
      }, 10000); // Check every 10 seconds
    },

    /**
     * Verify all connections and attempt reconnection if needed
     */
    async verifyConnections(): Promise<void> {
      try {
        // Update last connection check time
        this.lastConnectionTime = Date.now();

        // Check if mixer connection is still alive
        if (this.ip && !this.isDemoMode && (!this.isConnected || this.isConnectionStale)) {
          console.log('Connection appears stale, attempting reconnection...');
          await this.reconnectToMixer();
        }

        // Verify iframe connections
        this.verifyIframeConnections();
      } catch (error) {
        console.error('Error verifying connections:', error);

        // If verification fails, try reconnection
        if (this.ip && this.isPageVisible && !this.isDemoMode) {
          await this.reconnectToMixer();
        }
      }
    },

    /**
     * Verify iframe connections and reload if necessary
     */
    verifyIframeConnections(): void {
      // Check if iframes are responsive - Remove unnecessary type assertion
      const iframes = document.querySelectorAll('.mixer-iframe');

      iframes.forEach((iframe, index) => {
        // Cast to HTMLIFrameElement only when needed
        const iframeElement = iframe as HTMLIFrameElement;

        try {
          // Try to access iframe content (will throw if cross-origin)
          const iframeDoc = iframeElement.contentDocument;

          // If we can access it and it's blank, reload
          if (iframeDoc && (!iframeDoc.body || iframeDoc.body.children.length === 0)) {
            console.log(`Reloading iframe ${index} due to empty content`);
            this.reloadIframe(index);
          }
        } catch (error) {
          // Cross-origin iframe, check if src is set
          if (!iframeElement.src || iframeElement.src === 'about:blank') {
            console.log(`Reloading iframe ${index} due to missing src`);
            this.reloadIframe(index);
          }
        }
      });
    },

    /**
     * Reload specific iframe
     */
    reloadIframe(frameIndex: number): void {
      const iframe = document.querySelector(`#mixer-iframe-${frameIndex}`) as HTMLIFrameElement;
      if (iframe && iframe.src && iframe.src !== 'about:blank') {
        const currentSrc = iframe.src;
        iframe.src = 'about:blank';

        setTimeout(() => {
          iframe.src = currentSrc;
        }, 100);
      }
    },

    /**
     * Attempt to reconnect to mixer
     */
    async reconnectToMixer(): Promise<void> {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('Max reconnection attempts reached');
        return;
      }

      if (!this.isPageVisible) {
        console.log('Page not visible, skipping reconnection');
        return;
      }

      if (this.isDemoMode) {
        console.log('Demo mode active, skipping reconnection');
        return;
      }

      this.reconnectAttempts++;
      console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

      try {
        // Clear current connection state
        if (this.conn) {
          try {
            await this.conn.disconnect();
          } catch (error) {
            console.warn('Error disconnecting existing connection:', error);
          }
        }

        // Re-establish connection
        await this.uiConnect();

        if (this.isConnected) {
          console.log('Reconnection successful');
          this.reconnectAttempts = 0;
          this.lastConnectionTime = Date.now();
        }
      } catch (error) {
        console.error('Reconnection failed:', error);

        // Retry after delay with exponential backoff
        const delay = Math.min(2000 * Math.pow(2, this.reconnectAttempts - 1), 30000);

        const timeout = setTimeout(() => {
          visibilityManager.removeReconnectTimeout(timeout);
          if (this.isPageVisible && this.reconnectAttempts < this.maxReconnectAttempts) {
            // Use void operator to explicitly ignore the promise
            void this.reconnectToMixer();
          }
        }, delay);

        visibilityManager.addReconnectTimeout(timeout);
      }
    },

    /**
     * Cleanup method for store destruction
     */
    cleanup(): void {
      if (this.connectionCheckInterval) {
        clearInterval(this.connectionCheckInterval);
        this.connectionCheckInterval = null;
      }

      if (this.backgroundUpdateInterval) {
        clearInterval(this.backgroundUpdateInterval);
        this.backgroundUpdateInterval = null;
      }

      // Clean up subscriptions
      if (this.vuSubscription) {
        this.vuSubscription.unsubscribe();
        this.vuSubscription = null;
      }

      if (this.playerTimeSubscription) {
        this.playerTimeSubscription.unsubscribe();
        this.playerTimeSubscription = null;
      }

      visibilityManager.clearReconnectTimeouts();
    },

    getUiModel() {
      if (!this.conn) {
        return '';
      }
      return this.conn.deviceInfo.model;
    },
    getFirmwareVersion() {
    if (!this.conn) {
        return '';
      }
      // const firmware$ = this.conn.store.state$.pipe(
      //   map((state:any) => state.firmware),
      //   filter(e => !!e),
      //   first()
      // );
      // firmware$.subscribe((val:string) => {
      //   this.mixerInfo.firmware = val
      // })
      return this.conn.deviceInfo.firmware$;
    },
    getPlayerPlaylist() {
      if (!this.conn) {
        return '';
      }
      const playlists$ = this.conn.conn.allMessages$.pipe(
        map((state: any) => state),
        filter((e: any) => !!e && e.substring(0, 7) === 'PLISTS^'),
        first(),
      );

      playlists$.subscribe((val: any) => {
        console.log(val);
      });
    },
    getMixerPassword() {
      if (!this.conn) {
        return '';
      }
      const password$ = this.conn.store.state$.pipe(
        map((state: any) => state['settings.block.pass']),
        filter((e) => !!e),
        first(),
      );
      password$.subscribe((val: string) => {
        this.mixerPassword = val;
      });
    },
    uiStatusObserver(): Subscription | undefined {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }

      return this.conn.status$.subscribe((status: ConnectionStatusEvent) => {
        console.log(status.type);
        this.connStatus = status.type; // Ahora type-safe

        switch (status.type) {
          case ConnectionStatus.Opening:
            Loading.show({
              message: 'Connecting',
            });
            Loading.hide();
            break;
          case ConnectionStatus.Reconnecting:
            this.reconnectionCounter++;
            Loading.show({
              message: 'An error happened... retrying connection',
            });
            Loading.hide();
            break;
          case ConnectionStatus.Closing:
            Loading.show({
              message: 'Disconnecting',
            });
            break;
          case ConnectionStatus.Close:
            Loading.hide();
            break;
          case ConnectionStatus.Error:
            console.log(status);
            Notify.create({
              message: "Couldn't connect to your mixer, check your network connection",
              type: 'negative',
              position: 'center',
              timeout: 1000,
            });
            Loading.hide();
            if (this.reconnectionCounter >= 5) {
              // observer.unsubscribe(); // Se maneja automáticamente
              this.uiDisconnect(false).then(() => {}).catch(()=>{});
            }
            break;
          default:
            // Connection is "OPEN"
            console.log(status.type);
            this.reconnectionCounter = 0;
            this.lastConnectionTime = Date.now();
            this.getUiModel();
            this.getFirmwareVersion();
            this.listeners();
            this.setupModal = false;
            Loading.hide();
            break;
        }
      });
    },
    async uiConnect() {
      if (!isValidMixerIp(this.ip)) {
        this.setupModal = true;
        return;
      }

      this.isDemoMode = isAllowedURL(this.ip);

      if (this.isDemoMode) {
        this.setupModal = false;
        this.lastConnectionTime = Date.now();
        return;
      }

      this.conn = new SoundcraftUI({
        targetIP: this.ip,
        webSocketCtor: WebSocket,
      });

      this.uiStatusObserver();
      await this.conn.connect();
    },
    async uiDisconnect(reset = true) {
      if (!this.isDemoMode && this.conn) {
        await this.conn.disconnect();
      }
      this.setupModal = true;
      this.lastConnectionTime = 0;
      if (reset) {
        this.ip = '';
        reload(true);
      }
    },
    muteGroup(type: MuteGroupID): void {
      if (!this.conn) {
        console.warn('No connection available for mute group operation');
        return;
      }
      this.conn.muteGroup(type).mute();
    },

    unMuteGroup(type: MuteGroupID): void {
      if (!this.conn) {
        console.warn('No connection available for unmute group operation');
        return;
      }
      this.conn.muteGroup(type).unmute();
    },

    setFaderLevel(dbValue: number, type: string, channel: number | null = null) {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }
      switch (type) {
        case 'master':
          this.conn.master.setFaderLevelDB(dbValue);
          break;
        case 'input':
          this.conn.master.input(channel! + 1).setFaderLevelDB(dbValue);
          break;
        case 'gain':
          if (this.mixerInfo.model === 'UI24') {
            this.conn.hw(channel! + 1).setGainDB(dbValue);
          } else {
            // console.log(dbValue)
            //Workaround for Ui12 & Ui16
            this.conn.conn.sendMessage(`SETD^i.${channel}.gain^${DBToGainValue(dbValue)}`);
          }
          break;
        default:
          return null;
      }
    },
    setToggle(value: number, type: string, channel: number | null = null) {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }
      switch (type) {
        case 'hiz':
          console.log(value);
          this.conn.conn.sendMessage(`SETD^i.${channel}.hiz^${value}`);
          break;
        default:
          return null;
      }
    },

    playerActions(action: string) {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }
      switch (true) {
        case action === 'play':
          return this.conn.player.play();
        case action === 'pause':
          return this.conn.player.pause();
        case action === 'stop':
          return this.conn.player.stop();
        case action === 'next':
          return this.conn.player.next();
        case action === 'prev':
          return this.conn.player.prev();
        case action === 'shuffle':
          return this.conn.player.toggleShuffle();
        default:
        //
      }
    },
    dualTrackRecordToggle() {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }
      this.conn.recorderDualTrack.recordToggle();
    },

    playerListeners() {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }
      //Get Player State
      this.conn.player.state$.subscribe((value: number) => {
        this.mixerSettings.player.currentState = value;
      });
      this.conn.player.playlist$.subscribe((value: string) => {
        this.mixerSettings.player.currentPlaylist = value;
      });
      this.conn.player.track$.subscribe((value: string) => {
        this.mixerSettings.player.currentTrack = value;
      });
      this.conn.player.length$.subscribe((value: number) => {
        this.mixerSettings.player.currentLength = value;
      });
      this.conn.player.elapsedTime$.subscribe((value: number) => {
        this.mixerSettings.player.currentElapsedTime = value;
      });
      this.conn.player.remainingTime$.subscribe((value: number) => {
        this.mixerSettings.player.currentRemainingTime = value;
      });
    },

    // Remover import directo
    // import { useMidiStore } from 'stores/midi-store';

    // En la acción midiListeners(), cambiar:
    async midiListeners(): Promise<void> {
      if (!this.conn) return;

      // Usar inyección dinámica en lugar de import directo
      const { useMidiStore } = await import('stores/midi-store');
      const midiStore = useMidiStore();

      // Master Fader Level DB con tipo específico
      if (midiStore.currentMidiMapping.masterVolume.mapping) {
        this.conn.master.faderLevelDB$.subscribe((value: number) => {
          midiStore.sendMidiMessage(value, 'masterVolume');
        });
      }

      if (midiStore.inputUIDs.length) {
        for (let i = 0; i < midiStore.inputUIDs.length; i++) {
          const target = midiStore.findObjectByUID(
            midiStore.currentMidiMapping,
            midiStore.inputUIDs[i],
          );

          if (target.type === 'input') {
            this.conn.master.input(target.number + 1).faderLevelDB$.subscribe((value: number) => {
              if (!midiStore.activeInput)
                midiStore.sendMidiMessage(value, 'masterInput', target.number);
            });
          }

          if (target.type === 'gain') {
            if (this.mixerInfo.model === 'UI24') {
              this.conn.hw(target.number + 1).gainDB$.subscribe((value: number) => {
                if (!midiStore.activeInput)
                  midiStore.sendMidiMessage(value, 'gainInput', target.number);
              });
            }
          }
        }
      }
    },

    inputListeners(): void {
      if (!this.conn) return;

      const inputNames$ = this.conn.store.state$.pipe(
        map((state: Record<string, unknown>) =>
          Object.entries(state)
            .filter(([key]) => key.startsWith('i.') && key.endsWith('.name'))
            .map(([key, value]) => ({
              name: value as string,
              number: key.split('.')[1],
            } as InputNameData)),
        ),
        filter((names) => names.length > 0),
      );

      inputNames$.subscribe((inputNames: InputNameData[]) => {
        inputNames.forEach((input: InputNameData) => {
          this.channelNames[`masterInput${input.number}`] = input.name;
        });
      });
    },

    muteListeners() {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }
      //Master Mute
      this.conn.muteGroup('all').state$.subscribe((value: number) => {
        this.mixerSettings.muteGroups.master = value === 1;
      });
      //Mute FX
      this.conn.muteGroup('fx').state$.subscribe((value: number) => {
        this.mixerSettings.muteGroups.fx = value === 1;
      });
    },

    recorderListeners() {
      if (!this.conn) {
        console.warn('No connection available for status observation');
        return;
      }
      //Recorder
      this.conn.recorderDualTrack.recording$.subscribe((value: number) => {
        this.mixerSettings.recorder.dualTrack.isRecording = value === 1;
      });
      this.conn.recorderDualTrack.busy$.subscribe((value: number) => {
        this.mixerSettings.recorder.dualTrack.isBusy = value === 1;
      });
    },

    listeners() {
      this.playerListeners();
      this.inputListeners();
      this.muteListeners();
      this.recorderListeners();
      this.midiListeners().then(() => {}).catch(() => {});
    },
  },
  persist: {
    key: 'mixerStore',
    storage: localStorage,
    pick: ['ip'],
  },
});

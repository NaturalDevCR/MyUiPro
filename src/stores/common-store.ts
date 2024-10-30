import { defineStore } from 'pinia';

import * as app from '../../package.json'
export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    lang: <null|string>null,
    version: app.version,
    isDarkMode: true,
    barSize: '45px',
    modal: {
      layoutSelector: false,
      player: false
    }
  }),
  getters: {
    //
  },
  actions: {
    //
  },
  persist: {
    storage: localStorage,
    paths: ['lang'],
    // enabled: true,
    // strategies: [
    //   {
    //     key: 'commonStorage',
    //     storage: localStorage,
    //     paths: ['lang'],
    //   },
    // ],
  },
});

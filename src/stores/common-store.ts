import { defineStore } from 'pinia';

import { default as app } from '../../package.json';

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    lang: <null | string>null,
    version: app.version,
    isDarkMode: true,
    barSize: '45px',
    modal: {
      layoutSelector: false,
      player: false,
    },
  }),
  getters: {
    //
  },
  actions: {
    //
  },
  persist: [
    {
      key: 'commonStore',
      pick: ['lang'],
      storage: localStorage,
    },
  ],
});

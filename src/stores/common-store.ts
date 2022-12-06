import { defineStore } from 'pinia';

import * as app from '../../package.json'
export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    lang: <null|string>null,
    version: app.version
  }),
  getters: {
    //
  },
  actions: {
    //
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'commonStorage',
        storage: localStorage,
        paths: ['lang'],
      },
    ],
  },
});

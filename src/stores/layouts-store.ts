import { defineStore } from 'pinia';
import type {LayoutsState} from 'src/utils/types';
import {layoutOptions} from 'src/utils/constants/layout-constants';

export const useLayoutsStore = defineStore('layoutsStore', {
  state: (): LayoutsState => ({
    layoutsEditModal: true,
    selectedLayout: [{ height: '100%', selector: { class: '', height: '' } }],
    layoutOptions,
  }),

  getters: {
    //
  },

  actions: {
    //
  },
  persist: [
    {
      key: 'layoutsStore',
      pick: ['selectedLayout'],
      storage: localStorage,
    },
  ]
});

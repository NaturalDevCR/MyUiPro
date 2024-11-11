import { defineStore } from 'pinia';

export const useLayoutsStore = defineStore('layoutsStore', {
  state: () => ({
    layoutsEditModal: true,
    selectedLayout: <any[]>[{ height: '100%' }],
    layoutOptions: <any>{
      singleFrame: [{ height: '100%', id: '' }],
      doubleFrame: [{ height: '50%', id: '' }, { height: '50%', id: '' }],
      tripleFrameV1: [
        {
          height: '40%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
        { height: '60%', id: '' }
      ],
      tripleFrameV2: [
        { height: '60%', id: '' },
        {
          height: '40%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
      ],
      quadFrame: [
        {
          height: '50%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
        {
          height: '50%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
      ],
      quintupleFrameV1: [
        { height: '30%', id: '' },
        {
          height: '35%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
        {
          height: '35%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
      ],
      quintupleFrameV2: [
        {
          height: '35%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
        { height: '30%', id: '' },
        {
          height: '35%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
      ],
      quintupleFrameV3: [
        {
          height: '35%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
        {
          height: '35%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
        { height: '30%', id: '' }
      ],
      sextupleFrame: [
        {
          height: '25%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
        { height: '25%', id: '' },
        { height: '25%', id: '' },
        {
          height: '25%',
          frameIDs: {
            '0': '',
            '1': '',
          },
        },
      ],
    },
    defaultSyncID: false
  }),

  getters: {

  },

  actions: {

  },
  persist: {
    storage: localStorage,
    paths: ['selectedLayout', 'layoutOptions'],
  },
});

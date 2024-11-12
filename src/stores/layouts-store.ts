import { defineStore } from 'pinia';

export const useLayoutsStore = defineStore('layoutsStore', {
  state: () => ({
    layoutsEditModal: true,
    selectedLayout: <any[]>[{ height: '100%' }],
    layoutOptions: <any>{
      one: [{ height: '100%' }],
      two: [{ height: '50%' }, { height: '50%' }],
      threeV1: [
        {
          height: '40%',
          subFrames: 2
        },
        { height: '60%' }
      ],
      threeV2: [
        { height: '60%' },
        {
          height: '40%',
          subFrames: 2
        },
      ],
      four: [
        {
          height: '50%',
          subFrames: 2
        },
        {
          height: '50%',
          subFrames: 2
        },
      ],
      fiveV1: [
        { height: '30%' },
        {
          height: '35%',
          subFrames: 2
        },
        {
          height: '35%',
          subFrames: 2
        },
      ],
      fiveV2: [
        {
          height: '35%',
          subFrames: 2
        },
        { height: '30%' },
        {
          height: '35%',
          subFrames: 2
        },
      ],
      fiveV3: [
        {
          height: '35%',
          subFrames: 2
        },
        {
          height: '35%',
          subFrames: 2
        },
        { height: '30%' }
      ],
      sixV1: [
        {
          height: '25%',
          subFrames: 2
        },
        { height: '25%' },
        { height: '25%' },
        {
          height: '25%',
          subFrames: 2
        },
      ],
    },
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

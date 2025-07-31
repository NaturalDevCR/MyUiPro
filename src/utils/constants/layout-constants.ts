import type { LayoutOption } from 'src/utils/types';

const layoutOne: LayoutOption[] = [
  {
    height: '100%',
    selector: {
      class: 'col-12',
      height: '100px',
    },
  },
];

const layoutTwo: LayoutOption[] = [
  {
    height: '50%',
    selector: {
      class: 'col-12',
      height: '48px',
    },
  },
  {
    height: '50%',
    selector: {
      class: 'col-12',
      height: '48px',
    },
  },
];

const layoutThreeV1: LayoutOption[] = [
  {
    height: '40%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '50px',
    },
  },
  {
    height: '60%',
    selector: {
      class: 'col-12',
      height: '50px',
    },
  },
];

const layoutThreeV2: LayoutOption[] = [
  {
    height: '60%',
    selector: {
      class: 'col-12',
      height: '50px',
    },
  },
  {
    height: '40%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '50px',
    },
  },
];

const layoutFour: LayoutOption[] = [
  {
    height: '50%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '50px',
    },
  },
  {
    height: '50%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '50px',
    },
  },
];

const layoutFiveV1: LayoutOption[] = [
  {
    height: '30%',
    selector: {
      class: 'col-12',
      height: '33px',
    },
  },
  {
    height: '35%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
  {
    height: '35%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
];

const layoutFiveV2: LayoutOption[] = [
  {
    height: '35%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
  {
    height: '30%',
    selector: {
      class: 'col-12',
      height: '33px',
    },
  },
  {
    height: '35%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
];

const layoutFiveV3: LayoutOption[] = [
  {
    height: '35%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
  {
    height: '35%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
  {
    height: '30%',
    selector: {
      class: 'col-12',
      height: '33px',
    },
  },
];

const layoutSixV1: LayoutOption[] = [
  {
    height: '25%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
  {
    height: '25%',
    selector: {
      class: 'col-12',
      height: '33px',
    },
  },
  {
    height: '25%',
    selector: {
      class: 'col-12',
      height: '33px',
    },
  },
  {
    height: '25%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
];

const layoutSixV2: LayoutOption[] = [
  {
    height: '25%',
    selector: {
      class: 'col-12',
      height: '33px',
    },
  },
  {
    height: '25%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
  {
    height: '25%',
    subFrames: 2,
    selector: {
      class: 'col-6',
      height: '33px',
    },
  },
  {
    height: '25%',
    selector: {
      class: 'col-12',
      height: '33px',
    },
  },
];

export const layoutOptions: Record<string, LayoutOption[]> = {
  one: layoutOne,
  two: layoutTwo,
  threeV1: layoutThreeV1,
  threeV2: layoutThreeV2,
  four: layoutFour,
  fiveV1: layoutFiveV1,
  fiveV2: layoutFiveV2,
  fiveV3: layoutFiveV3,
  sixV1: layoutSixV1,
  sixV2: layoutSixV2,
};

export interface LayoutFrame {
  id: string;
}

interface FrameLayout {
  height: string;
  frames?: LayoutFrame[]; // frames es opcional
  id?: string;  // id también es opcional
}

export interface Layout {
  singleFrame: FrameLayout[];
  doubleFrame: FrameLayout[];
  tripleFrameV1: FrameLayout[];
  tripleFrameV2: FrameLayout[];
  quadFrame: FrameLayout[];
  quintupleFrameV1: FrameLayout[];
  quintupleFrameV2: FrameLayout[];
  quintupleFrameV3: FrameLayout[];
  sextupleFrame: FrameLayout[];
}

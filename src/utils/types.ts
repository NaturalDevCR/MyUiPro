export interface Selector {
  class: string;
  height: string;
}

export interface LayoutOption {
  height: string;
  subFrames?: number;
  selector: Selector;
}

export interface LayoutsState {
  layoutsEditModal: boolean;
  selectedLayout: LayoutOption[];
  layoutOptions: Record<string, LayoutOption[]>;
}

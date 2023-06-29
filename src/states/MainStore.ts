import { create } from "zustand";

interface MainState {
  isRecording: boolean;
  isCountingDown: boolean;
  startCountingDown: () => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useMainStore = create<MainState>()((set) => ({
  isRecording: false,
  isCountingDown: false,
  startCountingDown: () => set(() => ({ isCountingDown: true })),
  startRecording: () => set(() => ({ isRecording: true })),
  stopRecording: () =>
    set(() => ({ isRecording: false, isCountingDown: false })),
}));

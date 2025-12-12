import { create } from 'zustand';

export const useStore = create((set) => ({
    // Phases: 'tree' | 'blooming' | 'nebula' | 'collapsing'
    phase: 'tree',

    // Hand State
    handDetected: false,
    gesture: 'NONE', // 'Open_Palm', 'Closed_Fist', 'None'

    // UI State
    cameraEnabled: true,

    // Actions
    setPhase: (phase) => set({ phase }),
    setHandState: (detected, gesture) => set({ handDetected: detected, gesture }),
    toggleCamera: () => set((state) => ({ cameraEnabled: !state.cameraEnabled })),
}));

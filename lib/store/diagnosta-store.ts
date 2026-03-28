import { create } from 'zustand';

/**
 * STORE DR. GRILO CENTRALIZADO (ZUSTAND)
 */

interface DiagnostaStore {
  currentJobId: string | null;
  diagnosticos: Record<string, any>; 
  isAnalyzing: boolean;
  triggerRequested: boolean;
  lastSnapshotAt: string | null; // NUEVO: Sincronización temporal entre páginas
  setTriggerRequested: (val: boolean) => void;
  
  // Acciones
  setJobId: (id: string) => void;
  setAnalyzing: (status: boolean) => void;
  addDiagnostico: (nodeId: string, data: any) => void;
  setLastSnapshotAt: (val: string | null) => void; // NUEVO
  resetAll: () => void;
  setCurrentJobId: (id: string) => void;
}

export const useDiagnostaStore = create<DiagnostaStore>((set) => ({
  currentJobId: null,
  diagnosticos: {},
  isAnalyzing: false,
  triggerRequested: false,
  lastSnapshotAt: null,
  setTriggerRequested: (val) => set({ triggerRequested: val }),

  setJobId: (id) => set({ currentJobId: id }),
  setAnalyzing: (status) => set({ isAnalyzing: status }),
  setLastSnapshotAt: (val) => set({ lastSnapshotAt: val }),
  
  addDiagnostico: (nodeId, data) => set((state) => ({
    diagnosticos: { 
      ...state.diagnosticos, 
      [nodeId]: data 
    }
  })),

  setCurrentJobId: (id) => set({ currentJobId: id }),

  resetAll: () => set({ diagnosticos: {}, currentJobId: null, isAnalyzing: false, lastSnapshotAt: null })
}));

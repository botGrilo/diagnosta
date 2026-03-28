import { create } from 'zustand';

/**
 * STORE SRE CENTRALIZADO (ZUSTAND)
 * 
 * Este store funciona como el "Single Source of Truth" para los diagnósticos.
 * Permite que las tarjetas se actualicen en tiempo real y que los modales
 * clínicos tengan acceso a las "Recetas Médicas" (ai_recipe) sin perder datos.
 */

interface DiagnostaStore {
  currentJobId: string | null;
  diagnosticos: Record<string, any>; // Mapa: node_id => payload_n8n
  isAnalyzing: boolean;
  triggerRequested: boolean;
  setTriggerRequested: (val: boolean) => void;
  
  // Acciones
  setJobId: (id: string) => void;
  setAnalyzing: (status: boolean) => void;
  addDiagnostico: (nodeId: string, data: any) => void;
  resetAll: () => void;
}

export const useDiagnostaStore = create<DiagnostaStore>((set) => ({
  currentJobId: null,
  diagnosticos: {},
  isAnalyzing: false,
  triggerRequested: false,
  setTriggerRequested: (val) => set({ triggerRequested: val }),

  setJobId: (id) => set({ currentJobId: id }),
  setAnalyzing: (status) => set({ isAnalyzing: status }),
  
  /**
   * Inyecta un nuevo diagnóstico recibido por SSE (FIFO)
   */
  addDiagnostico: (nodeId, data) => set((state) => ({
    diagnosticos: { 
      ...state.diagnosticos, 
      [nodeId]: data 
    }
  })),

  resetAll: () => set({ diagnosticos: {}, currentJobId: null, isAnalyzing: false })
}));

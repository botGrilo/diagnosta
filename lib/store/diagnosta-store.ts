import { create } from 'zustand';

/**
 * STORE DR. GRILO CENTRALIZADO (ZUSTAND)
 */

interface ConsoleLine {
  id: string
  timestamp: string
  endpoint_name: string
  cat: 'RED' | 'PROT'
  msg: string
}

interface DiagnostaStore {
  currentJobId: string | null;
  diagnosticos: Record<string, any>; 
  isAnalyzing: boolean;
  triggerRequested: boolean;
  lastSnapshotAt: string | null;
  
  // Consola Neuronal
  consoleLogs: ConsoleLine[];
  panicMode: boolean;
  showGlobal: boolean; // Toggle de pilares (SALA DE CONSTANTES VITALES)
  userEndpointNames: string[]; // Nombres de los endpoints del usuario para filtrado
  
  // Acciones
  setTriggerRequested: (val: boolean) => void;
  setJobId: (id: string) => void;
  setAnalyzing: (status: boolean) => void;
  addDiagnostico: (nodeId: string, data: any) => void;
  setLastSnapshotAt: (val: string | null) => void;
  resetAll: () => void;
  setCurrentJobId: (id: string) => void;
  
  // Acción Neural
  addConsoleLines: (data: any) => void;
  setPanicMode: (val: boolean) => void;
  setShowGlobal: (val: boolean) => void;
  setUserEndpointNames: (names: string[]) => void;
  rotateConsoleLog: () => void; // Acción cíclica para movimiento infinito
}

export const useDiagnostaStore = create<DiagnostaStore>((set) => ({
  currentJobId: null,
  diagnosticos: {},
  isAnalyzing: false,
  triggerRequested: false,
  lastSnapshotAt: null,
  consoleLogs: [],
  panicMode: false,
  showGlobal: true, // Siempre ON por defecto según pedido clínico
  userEndpointNames: [],

  setTriggerRequested: (val) => set({ triggerRequested: val }),
  setJobId: (id) => set({ currentJobId: id }),
  setAnalyzing: (status) => set({ isAnalyzing: status }),
  setLastSnapshotAt: (val) => set({ lastSnapshotAt: val }),
  setPanicMode: (val) => set({ panicMode: val }),
  setShowGlobal: (val) => set({ showGlobal: val }),
  setUserEndpointNames: (names) => set({ userEndpointNames: names }),
  
  rotateConsoleLog: () => set((state) => {
    if (state.consoleLogs.length <= 1) return state;
    const [first, ...rest] = state.consoleLogs;
    // Rotamos la primera línea al final para simular movimiento infinito
    return { consoleLogs: [...rest, first] };
  }),

  addDiagnostico: (nodeId, data) => set((state) => ({
    diagnosticos: { 
      ...state.diagnosticos, 
      [nodeId]: data 
    }
  })),

  addConsoleLines: (data: any) => set((state) => {
    const newLines = (data.quick_insights || []).map((ins: any) => ({
      id: `${data.name}-${data.timestamp || new Date().toISOString()}-${ins.cat}`, // ID Determinista
      timestamp: data.timestamp || new Date().toISOString(),
      endpoint_name: data.name || 'Sistema',
      cat: ins.cat,
      msg: ins.msg
    }));

    // Filtrar los que ya existen para evitar duplicados por SWR Refresh
    const existingIds = new Set(state.consoleLogs.map((l: any) => l.id));
    const uniqueNew = newLines.filter((l: any) => !existingIds.has(l.id));

    if (uniqueNew.length === 0) return state; // Sin cambios, no disparamos render

    return {
      consoleLogs: [...state.consoleLogs, ...uniqueNew].slice(-50)
    };
  }),

  setCurrentJobId: (id) => set({ currentJobId: id }),
  resetAll: () => set({ 
    diagnosticos: {}, 
    currentJobId: null, 
    isAnalyzing: false, 
    lastSnapshotAt: null,
    consoleLogs: [],
    panicMode: false,
    showGlobal: true,
    userEndpointNames: []
  })
}));

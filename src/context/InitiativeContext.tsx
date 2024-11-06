import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Initiative, KPI } from '../data/mockData';

interface InitiativeState {
  initiatives: Initiative[];
  loading: boolean;
  error: string | null;
  auditLog: AuditEntry[];
}

interface AuditEntry {
  id: number;
  timestamp: string;
  action: 'create' | 'update' | 'delete';
  initiativeId: number;
  user: string;
  changes: Record<string, any>;
}

type InitiativeAction =
  | { type: 'SET_INITIATIVES'; payload: Initiative[] }
  | { type: 'ADD_INITIATIVE'; payload: Initiative }
  | { type: 'UPDATE_INITIATIVE'; payload: Initiative }
  | { type: 'DELETE_INITIATIVE'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_AUDIT_ENTRY'; payload: AuditEntry }
  | { type: 'UPDATE_KPI'; payload: { initiativeId: number; kpis: KPI[] } }
  | { type: 'UPDATE_PROGRESS'; payload: { initiativeId: number; progress: number } };

const initiativeReducer = (state: InitiativeState, action: InitiativeAction): InitiativeState => {
  switch (action.type) {
    case 'SET_INITIATIVES':
      return {
        ...state,
        initiatives: action.payload,
        loading: false,
      };
    case 'ADD_INITIATIVE':
      return {
        ...state,
        initiatives: [...state.initiatives, action.payload],
      };
    case 'UPDATE_INITIATIVE':
      return {
        ...state,
        initiatives: state.initiatives.map(initiative =>
          initiative.id === action.payload.id ? action.payload : initiative
        ),
      };
    case 'DELETE_INITIATIVE':
      return {
        ...state,
        initiatives: state.initiatives.filter(initiative => initiative.id !== action.payload),
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'ADD_AUDIT_ENTRY':
      return {
        ...state,
        auditLog: [...state.auditLog, action.payload],
      };
    case 'UPDATE_KPI':
      return {
        ...state,
        initiatives: state.initiatives.map(initiative =>
          initiative.id === action.payload.initiativeId
            ? { ...initiative, kpis: action.payload.kpis }
            : initiative
        ),
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        initiatives: state.initiatives.map(initiative =>
          initiative.id === action.payload.initiativeId
            ? { ...initiative, progress: action.payload.progress }
            : initiative
        ),
      };
    default:
      return state;
  }
};

const InitiativeContext = createContext<{
  state: InitiativeState;
  dispatch: React.Dispatch<InitiativeAction>;
} | null>(null);

export const InitiativeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(initiativeReducer, {
    initiatives: [],
    loading: true,
    error: null,
    auditLog: [],
  });

  const addAuditEntry = (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_AUDIT_ENTRY',
      payload: {
        ...entry,
        id: Date.now(),
        timestamp: new Date().toISOString(),
      },
    });
  };

  useEffect(() => {
    // Initialize with mock data
    import('../data/mockData').then(({ initiatives }) => {
      dispatch({ type: 'SET_INITIATIVES', payload: initiatives });
    });
  }, []);

  useEffect(() => {
    // Validate data consistency
    const validateData = () => {
      state.initiatives.forEach(initiative => {
        if (initiative.progress < 0 || initiative.progress > 100) {
          dispatch({
            type: 'SET_ERROR',
            payload: `Invalid progress value for initiative ${initiative.id}`,
          });
        }
      });
    };

    validateData();
  }, [state.initiatives]);

  return (
    <InitiativeContext.Provider value={{ state, dispatch }}>
      {children}
    </InitiativeContext.Provider>
  );
};

export const useInitiatives = () => {
  const context = useContext(InitiativeContext);
  if (!context) {
    throw new Error('useInitiatives must be used within an InitiativeProvider');
  }
  return context;
};

export const useInitiativeActions = () => {
  const { dispatch } = useInitiatives();

  const addInitiative = (initiative: Omit<Initiative, 'id'>) => {
    const newInitiative = {
      ...initiative,
      id: Date.now(),
    };

    dispatch({ type: 'ADD_INITIATIVE', payload: newInitiative as Initiative });
    return newInitiative;
  };

  const updateInitiative = (initiative: Initiative) => {
    dispatch({ type: 'UPDATE_INITIATIVE', payload: initiative });
  };

  const deleteInitiative = (id: number) => {
    dispatch({ type: 'DELETE_INITIATIVE', payload: id });
  };

  const updateKPIs = (initiativeId: number, kpis: KPI[]) => {
    dispatch({ type: 'UPDATE_KPI', payload: { initiativeId, kpis } });
  };

  const updateProgress = (initiativeId: number, progress: number) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { initiativeId, progress } });
  };

  return {
    addInitiative,
    updateInitiative,
    deleteInitiative,
    updateKPIs,
    updateProgress,
  };
};
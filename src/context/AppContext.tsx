import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState } from '../types';
import mockData from '../data/mockData.json';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'SET_GOAL'; payload: string }
  | { type: 'SET_DEPARTMENT'; payload: "Finanzen" | "Produktion" }
  | { type: 'SET_PERIOD'; payload: "Q3 2025" | "Q4 2025" }
  | { type: 'SET_DATA_MODE'; payload: "Unternehmenswissen" | "Zusätzliche Angaben" }
  | { type: 'SET_TASK'; payload: string }
  | { type: 'UPDATE_PARAMS'; payload: Partial<AppState['params']> };

const initialState: AppState = {
  goal: mockData.defaults.goal,
  department: mockData.defaults.department as "Finanzen" | "Produktion",
  period: mockData.defaults.period as "Q3 2025" | "Q4 2025",
  dataMode: mockData.defaults.dataMode as "Unternehmenswissen" | "Zusätzliche Angaben",
  task: mockData.task_autogen,
  params: {
    tariff_increase_pct: 20,
    tariff_start_date: "2025-10-01",
    baseline_planned_costs_eur: 2000000,
    machines_count: 20,
    machine_failure_prob: 0.05,
    repair_cost_per_machine_day_eur: 5000,
    period: "Q4 2025",
    department: "Produktion"
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_GOAL':
      return { ...state, goal: action.payload };
    case 'SET_DEPARTMENT':
      return { ...state, department: action.payload };
    case 'SET_PERIOD':
      return { ...state, period: action.payload };
    case 'SET_DATA_MODE':
      return { ...state, dataMode: action.payload };
    case 'SET_TASK':
      return { ...state, task: action.payload };
    case 'UPDATE_PARAMS':
      return { ...state, params: { ...state.params, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
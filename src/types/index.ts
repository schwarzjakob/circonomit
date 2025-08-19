export interface AppState {
  goal: string;
  department: "Finanzen" | "Produktion";
  period?: "Q3 2025" | "Q4 2025";
  dataMode: "Unternehmenswissen" | "Zusätzliche Angaben";
  task: string;
  params: {
    tariff_increase_pct: number;
    tariff_start_date: string;
    baseline_planned_costs_eur: number;
    machines_count: number;
    machine_failure_prob: number;
    repair_cost_per_machine_day_eur: number;
    period: string;
    department: string;
  };
}

export interface ModelNode {
  id: string;
  type: "block" | "calc" | "scenario";
  title: string;
  fields: Record<string, any>;
  position: { x: number; y: number };
}

export interface ModelEdge {
  from: string;
  to: string;
}

export interface KPIData {
  total_costs_q4_scenario_eur: number;
  incremental_tariff_costs_eur: number;
  savings_preproduction_net_eur: number;
  message: string;
}

export interface CostSeriesData {
  month: string;
  baseline: number;
  tariff: number;
  preproduce: number;
}

export interface InventorySeriesData {
  month: string;
  inventory_costs: number;
  tariff_extra: number;
}

export interface Recommendation {
  title: string;
  body: string;
  type: "action" | "insight";
}

export interface InsightsData {
  kpis: KPIData;
  series_costs: CostSeriesData[];
  series_inventory: InventorySeriesData[];
  recommendations: Recommendation[];
  disclaimer: string;
}

export interface OKR {
  id: string;
  title: string;
  department: string;
  quarter: string;
  year: string;
}

export interface SimulationTile {
  id: string;
  title: string;
  department: string;
  timeframe: string;
  quarter: string;
  year: string;
  okrs: string[];
  chartData: any[];
  chartType: 'line' | 'bar';
  insight: string;
  status: 'completed' | 'mock';
  createdDate: string;
}
export type Block = {
  id: string;
  label: string;
  description?: string;
};

export type Attribute = {
  blockId: string;
  key: string;
  label: string;
  type: "text" | "number" | "currency" | "percent" | "date";
  unit?: string;
};

export type Edge = {
  from: string;
  to: string;
  key: string;
  label: string;
};

export type Ontology = {
  meta: {
    source: string;
    version: string;
    notice?: string;
  };
  blocks: Block[];
  attributes: Attribute[];
  edges: Edge[];
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: number;
};

export type Selection = {
  blocks: Set<string>;
  edges: Set<string>;
  attributes: Set<string>;
};

export type ParsedCommand = {
  action: 'highlight' | 'show' | 'add' | 'remove' | 'export' | 'reset';
  entities: {
    blocks: string[];
    edges: string[];
    attributes: string[];
  };
  raw: string;
};

export type NodePosition = {
  x: number;
  y: number;
};

export type LayoutColumn = 
  | 'supplier'
  | 'material' 
  | 'process'
  | 'facility'
  | 'product'
  | 'order'
  | 'shipment'
  | 'inventory'
  | 'market';
import { create } from 'zustand';
import { Ontology, Selection, ChatMessage, Block, Edge, Attribute } from './types';

interface OntologyState {
  // Data
  ontology: Ontology | null;
  
  // UI State
  selectedBlock: string | null;
  highlightedNodes: Set<string>;
  highlightedEdges: Set<string>;
  highlightedAttributes: Set<string>;
  selection: Selection;
  
  // Chat
  messages: ChatMessage[];
  commandHistory: string[];
  
  // Layout
  attributesDrawerOpen: boolean;
  
  // Actions
  loadOntology: (ontology: Ontology) => void;
  setSelectedBlock: (blockId: string | null) => void;
  
  // Highlighting
  highlightNodes: (nodeIds: string[]) => void;
  highlightEdges: (edgeKeys: string[]) => void;
  highlightAttributes: (attributeKeys: string[]) => void;
  clearHighlights: () => void;
  
  // Selection
  toggleBlockSelection: (blockId: string) => void;
  toggleEdgeSelection: (edgeKey: string) => void;
  toggleAttributeSelection: (attributeKey: string) => void;
  clearSelection: () => void;
  removeFromSelection: (entityId: string) => void;
  
  // Chat
  addMessage: (text: string, sender: 'user' | 'system') => void;
  addToCommandHistory: (command: string) => void;
  getLastCommand: () => string | null;
  
  // Drawer
  setAttributesDrawerOpen: (open: boolean) => void;
  
  // Export
  exportSelection: () => { nodes: Block[]; edges: Edge[]; attributes: Attribute[] };
}

export const useOntologyStore = create<OntologyState>((set, get) => ({
  // Initial state
  ontology: null,
  selectedBlock: null,
  highlightedNodes: new Set(),
  highlightedEdges: new Set(),
  highlightedAttributes: new Set(),
  selection: {
    blocks: new Set(),
    edges: new Set(),
    attributes: new Set(),
  },
  messages: [],
  commandHistory: [],
  attributesDrawerOpen: false,

  // Data actions
  loadOntology: (ontology: Ontology) => set({ ontology }),

  setSelectedBlock: (blockId: string | null) => 
    set({ 
      selectedBlock: blockId,
      attributesDrawerOpen: blockId !== null 
    }),

  // Highlighting actions
  highlightNodes: (nodeIds: string[]) => 
    set((state) => ({
      highlightedNodes: new Set([...state.highlightedNodes, ...nodeIds])
    })),

  highlightEdges: (edgeKeys: string[]) => 
    set((state) => ({
      highlightedEdges: new Set([...state.highlightedEdges, ...edgeKeys])
    })),

  highlightAttributes: (attributeKeys: string[]) => 
    set((state) => ({
      highlightedAttributes: new Set([...state.highlightedAttributes, ...attributeKeys])
    })),

  clearHighlights: () => 
    set({
      highlightedNodes: new Set(),
      highlightedEdges: new Set(),
      highlightedAttributes: new Set(),
    }),

  // Selection actions
  toggleBlockSelection: (blockId: string) => 
    set((state) => {
      const newBlocks = new Set(state.selection.blocks);
      if (newBlocks.has(blockId)) {
        newBlocks.delete(blockId);
      } else {
        newBlocks.add(blockId);
      }
      return {
        selection: { ...state.selection, blocks: newBlocks }
      };
    }),

  toggleEdgeSelection: (edgeKey: string) => 
    set((state) => {
      const newEdges = new Set(state.selection.edges);
      if (newEdges.has(edgeKey)) {
        newEdges.delete(edgeKey);
      } else {
        newEdges.add(edgeKey);
      }
      return {
        selection: { ...state.selection, edges: newEdges }
      };
    }),

  toggleAttributeSelection: (attributeKey: string) => 
    set((state) => {
      const newAttributes = new Set(state.selection.attributes);
      if (newAttributes.has(attributeKey)) {
        newAttributes.delete(attributeKey);
      } else {
        newAttributes.add(attributeKey);
      }
      return {
        selection: { ...state.selection, attributes: newAttributes }
      };
    }),

  clearSelection: () => 
    set({
      selection: {
        blocks: new Set(),
        edges: new Set(),
        attributes: new Set(),
      }
    }),

  removeFromSelection: (entityId: string) => 
    set((state) => {
      const newSelection = { ...state.selection };
      newSelection.blocks.delete(entityId);
      newSelection.edges.delete(entityId);
      newSelection.attributes.delete(entityId);
      return { selection: newSelection };
    }),

  // Chat actions
  addMessage: (text: string, sender: 'user' | 'system') => 
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          text,
          sender,
          timestamp: Date.now(),
        }
      ]
    })),

  addToCommandHistory: (command: string) => 
    set((state) => ({
      commandHistory: [...state.commandHistory, command]
    })),

  getLastCommand: () => {
    const { commandHistory } = get();
    return commandHistory.length > 0 ? commandHistory[commandHistory.length - 1] : null;
  },

  // Drawer actions
  setAttributesDrawerOpen: (open: boolean) => 
    set({ attributesDrawerOpen: open }),

  // Export action
  exportSelection: () => {
    const { ontology, selection } = get();
    if (!ontology) return { nodes: [], edges: [], attributes: [] };

    const selectedNodes = ontology.blocks.filter(block => 
      selection.blocks.has(block.id)
    );
    
    const selectedEdges = ontology.edges.filter(edge => 
      selection.edges.has(edge.key)
    );
    
    const selectedAttributes = ontology.attributes.filter(attr => 
      selection.attributes.has(attr.key)
    );

    return {
      nodes: selectedNodes,
      edges: selectedEdges,
      attributes: selectedAttributes,
    };
  },
}));
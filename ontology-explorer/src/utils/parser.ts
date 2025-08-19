import { ParsedCommand, Block, Edge, Attribute } from '../types';

// Synonym mapping
const SYNONYMS: Record<string, string> = {
  // Block synonyms
  'factory': 'Facility',
  'plant': 'Facility',
  'warehouse': 'Facility',
  'supplier': 'Supplier',
  'vendor': 'Supplier',
  'material': 'Material',
  'component': 'Material',
  'resource': 'Material',
  'process': 'Process',
  'manufacturing': 'Process',
  'production': 'Process',
  'product': 'Product',
  'good': 'Product',
  'item': 'Product',
  'order': 'Order',
  'purchase': 'Order',
  'shipment': 'Shipment',
  'delivery': 'Shipment',
  'inventory': 'Inventory',
  'stock': 'Inventory',
  'market': 'Market',
  'economy': 'Market',
  
  // Attribute synonyms
  'tariff': 'circo:tariffRate',
  'tariff rate': 'circo:tariffRate',
  'tax': 'circo:tariffRate',
  'energy price': 'circo:energyPriceEURperMWh',
  'power cost': 'circo:energyPriceEURperMWh',
  'electricity price': 'circo:energyPriceEURperMWh',
  'reliability': 'circo:reliabilityScore',
  'cost': 'circo:unitCost',
  'price': 'circo:marketPrice',
  'capacity': 'circo:capacity',
  'efficiency': 'circo:efficiency',
  'cycle time': 'circo:cycleTime',
  'lead time': 'circo:leadTimeVariance',
  'delivery time': 'circo:deliveryTime',
  'stock level': 'circo:stockLevel',
  'inflation': 'circo:inflationRate',
};

const ACTION_KEYWORDS = {
  highlight: ['highlight', 'show', 'display', 'focus'],
  add: ['add', 'include', 'select', 'pin'],
  remove: ['remove', 'delete', 'unselect', 'clear', 'hide'],
  export: ['export', 'download', 'save'],
  reset: ['reset', 'clear all', 'start over'],
};

export class CommandParser {
  private blocks: Block[];
  private edges: Edge[];
  private attributes: Attribute[];

  constructor(blocks: Block[], edges: Edge[], attributes: Attribute[]) {
    this.blocks = blocks;
    this.edges = edges;
    this.attributes = attributes;
  }

  parse(input: string): ParsedCommand {
    const normalizedInput = input.toLowerCase().trim();
    const tokens = this.tokenize(normalizedInput);
    
    // Determine action
    const action = this.parseAction(tokens);
    
    // Extract entities
    const entities = this.extractEntities(tokens, normalizedInput);
    
    return {
      action,
      entities,
      raw: input,
    };
  }

  private tokenize(input: string): string[] {
    // Simple tokenization - split by common delimiters
    return input
      .replace(/[^\w\s:]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  private parseAction(tokens: string[]): ParsedCommand['action'] {
    for (const [action, keywords] of Object.entries(ACTION_KEYWORDS)) {
      if (keywords.some(keyword => tokens.includes(keyword))) {
        return action as ParsedCommand['action'];
      }
    }
    
    // Default to highlight for ambiguous commands
    return 'highlight';
  }

  private extractEntities(tokens: string[], originalInput: string): ParsedCommand['entities'] {
    const entities = {
      blocks: [] as string[],
      edges: [] as string[],
      attributes: [] as string[],
    };

    // Extract blocks
    entities.blocks = this.extractBlocks(tokens, originalInput);
    
    // Extract edges
    entities.edges = this.extractEdges(tokens, originalInput);
    
    // Extract attributes
    entities.attributes = this.extractAttributes(tokens, originalInput);

    return entities;
  }

  private extractBlocks(tokens: string[], originalInput: string): string[] {
    const found: string[] = [];
    
    // Check for direct block name matches
    for (const block of this.blocks) {
      const blockName = block.label.toLowerCase();
      if (tokens.includes(blockName) || originalInput.includes(blockName)) {
        found.push(block.id);
      }
    }
    
    // Check synonyms
    for (const token of tokens) {
      const synonym = SYNONYMS[token];
      if (synonym && this.blocks.find(b => b.id === synonym)) {
        found.push(synonym);
      }
    }
    
    return [...new Set(found)];
  }

  private extractEdges(tokens: string[], originalInput: string): string[] {
    const found: string[] = [];
    
    // Look for "from X to Y" patterns
    const fromMatch = originalInput.match(/from\s+(\w+)\s+to\s+(\w+)/i);
    if (fromMatch) {
      const [, fromEntity, toEntity] = fromMatch;
      const fromBlock = this.findBlockByName(fromEntity);
      const toBlock = this.findBlockByName(toEntity);
      
      if (fromBlock && toBlock) {
        const edge = this.edges.find(e => e.from === fromBlock && e.to === toBlock);
        if (edge) {
          found.push(edge.key);
        }
      }
    }
    
    // Look for edge label matches
    for (const edge of this.edges) {
      const edgeLabel = edge.label.toLowerCase();
      if (tokens.some(token => edgeLabel.includes(token))) {
        found.push(edge.key);
      }
    }
    
    return [...new Set(found)];
  }

  private extractAttributes(tokens: string[], originalInput: string): string[] {
    const found: string[] = [];
    
    // Check for direct attribute matches
    for (const attr of this.attributes) {
      const attrLabel = attr.label.toLowerCase();
      if (tokens.some(token => attrLabel.includes(token)) || 
          originalInput.includes(attrLabel)) {
        found.push(attr.key);
      }
    }
    
    // Check synonyms
    for (const [synonym, attrKey] of Object.entries(SYNONYMS)) {
      if (originalInput.includes(synonym) && 
          this.attributes.find(a => a.key === attrKey)) {
        found.push(attrKey);
      }
    }
    
    return [...new Set(found)];
  }

  private findBlockByName(name: string): string | null {
    const normalizedName = name.toLowerCase();
    
    // Direct match
    const directMatch = this.blocks.find(b => 
      b.label.toLowerCase() === normalizedName
    );
    if (directMatch) return directMatch.id;
    
    // Synonym match
    const synonym = SYNONYMS[normalizedName];
    if (synonym) return synonym;
    
    return null;
  }

  // Generate disambiguation question if multiple matches
  generateDisambiguation(entities: ParsedCommand['entities']): string | null {
    const totalMatches = 
      entities.blocks.length + 
      entities.edges.length + 
      entities.attributes.length;
    
    if (totalMatches === 0) {
      return "I couldn't find any matching entities. Try being more specific.";
    }
    
    if (entities.blocks.length > 3) {
      return `Found ${entities.blocks.length} blocks. Did you mean: ${entities.blocks.slice(0, 3).join(', ')}?`;
    }
    
    return null;
  }
}
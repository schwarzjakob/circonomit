# Ontology Explorer

A **Model-Left/Chat-Right** interactive ontology browser built with Next.js, React Flow, and TypeScript. Explore IOF Supply Chain ontology + Circonomit extensions through natural language commands.

![Ontology Explorer](https://via.placeholder.com/800x400/f8f9fa/374151?text=Ontology+Explorer)

## Features

### 🗨️ **Chat Interface** (Left Panel, 1/3 width)
- **Natural language commands** for graph exploration
- **Command history** and context awareness
- **Smart NLP parser** with synonym mapping
- **Export & screenshot** controls

### 🕸️ **Interactive Graph** (Right Panel, 2/3 width)  
- **React Flow visualization** of blocks and edges
- **Intelligent layout** by supply chain stages
- **Highlighting** for nodes, edges, and attributes
- **Click interactions** and context menus
- **Visual selection indicators**

### 📋 **Attributes Drawer**
- **Dynamic attributes panel** for selected blocks
- **Type-coded attributes** (currency, percent, date, etc.)
- **Pin/unpin functionality** for attribute selection
- **Auto-scroll to highlighted attributes**

## Quick Start

```bash
# Install dependencies
npm install

# Start development server  
npm run dev

# Open browser to http://localhost:3000
```

## Commands Reference

| Command | Action | Example |
|---------|--------|---------|
| `highlight [entities]` | Highlight nodes/edges | "highlight product and supplier" |
| `show edges from X to Y` | Display specific edges | "show edges from product to material" |  
| `add [attributes] to view` | Open attributes drawer | "add tariff rate and energy price to the view" |
| `remove [entities]` | Unselect entities | "remove shipment from selection" |
| `export current selection` | Download JSON | Downloads `selection.json` |
| `reset` | Clear all highlights | Clears highlights and selections |

### Smart Synonyms
The parser recognizes these synonyms:
- **Blocks:** factory/plant → Facility, vendor → Supplier, component → Material
- **Attributes:** tariff → `circo:tariffRate`, energy price → `circo:energyPriceEURperMWh`

## Data Structure

```typescript
type Block = { id: string; label: string; description?: string };
type Attribute = { blockId: string; key: string; label: string; type: "text"|"number"|"currency"|"percent"|"date"; unit?: string };
type Edge = { from: string; to: string; key: string; label: string };
```

## Project Structure

```
src/
├── app/page.tsx           # Main layout component
├── types.ts              # TypeScript definitions
├── store.ts              # Zustand state management  
├── graph/GraphCanvas.tsx # React Flow graph component
├── chat/ChatPanel.tsx    # Chat interface + NLP parser
├── components/           # Reusable components
├── utils/
│   ├── parser.ts         # NLP command parser
│   └── export.ts         # JSON/PNG export utilities
public/
└── ontology.min.json     # Ontology data (IOF + circo: extensions)
```

## Tech Stack

- **Frontend:** Next.js 15 + React + TypeScript
- **Graph:** React Flow with custom nodes/edges  
- **State:** Zustand store for selections/highlights
- **Styling:** Tailwind CSS + custom components
- **Export:** html2canvas for screenshots, JSON download

## Acceptance Tests

✅ **Test 1:** Graph renders with all blocks on load  
✅ **Test 2:** "highlight product and supplier" highlights nodes  
✅ **Test 3:** Clicking node opens attributes drawer  
✅ **Test 4:** "show edges from product to material" highlights edges  
✅ **Test 5:** "add tariff rate and energy price" opens drawer and flashes attributes  
✅ **Test 6:** "export current selection" downloads selection.json  
✅ **Test 7:** Resizable panels with drag handles  

## Development Notes

- **Zero backend required** - pure client-side JSON loading
- **Strict TypeScript** with comprehensive type safety
- **Under 1k LOC** total implementation
- **ESLint configured** for code quality

## License

MIT - Built for ontology exploration and supply chain modeling

---

**Quick Demo Commands:**
1. `highlight supplier and market`
2. `show edges from material to process`  
3. `add energy price and capacity to the view`
4. `export current selection`

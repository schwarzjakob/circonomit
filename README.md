# Circonomit - German Customer Journey Prototype

Ein UI-only Prototyp für eine deutsche Customer Journey, der den Entscheidungsfindungsprozess von Circonomit demonstriert.

## Übersicht

Dieser Prototyp zeigt das vollständige Circonomit-System mit zwei Hauptbereichen:

### 📚 Bibliothek (`/library`)
- **Simulationsbibliothek** mit intelligenter Filterung nach Bereich, Zeit und OKRs
- **5 Demo-Simulationen** als interaktive Kacheln mit Charts und Erkenntnissen  
- **Abhängige Filter** (OKRs filtern nach Bereich/Zeit)
- **Eine funktionale Simulation** (Produktionskosten) verlinkt zur bestehenden Journey

### ⚡ Simulation (`/simulation/*`)
1. **Ziel festlegen** (`/simulation/goal`) - Geschäftsziel-Eingabe mit deutschen Formularen
2. **Simulationsauftrag** (`/simulation/task`) - Automatisch generierte Simulationsbeschreibung
3. **Modellierung** (`/simulation/model`) - Interaktives Whiteboard ("Ein Miro das rechnen kann")
4. **Erkenntnisse** (`/simulation/insights`) - Dashboard mit Charts und Handlungsempfehlungen

## Funktionen

### ✅ Implementiert
- **Vollständige 4-Screen Simulation** mit Zurück/Weiter-Buttons
- **Simulationsbibliothek** mit intelligenter Filterung und Suche
- **5 Demo-Simulationen** mit verschiedenen Charts (Line/Bar)
- **Abhängige Filter-Logik** (Department → OKRs → Zeit)
- **Deutsche Lokalisierung** aller UI-Texte und Labels
- **Responsive Design** mit Tailwind CSS
- **Interaktive Modellierung** mit editierbaren Nodes und visuellen Verbindungen
- **Charts & Visualisierungen** mit Recharts (Kosten-Trends, Inventar-Vergleiche)
- **Hardcoded Demo-Daten** für alle Szenarien
- **TypeScript** für Typsicherheit
- **State Management** mit React Context

### 🎯 Demo-Features
- Upload-Komponenten (UI-only, deaktiviert)
- Export-Button (zeigt Demo-Toast)
- Editierbare Simulationsparameter
- Interaktive Whiteboard-Nodes
- Empfehlungskarten mit Prioritäten

## Technologie-Stack

- **React 19** mit TypeScript
- **Tailwind CSS** für Styling
- **React Router** für Navigation
- **Recharts** für Diagramme
- **Lucide React** für Icons
- **Create React App** als Build-Tool

## Installation & Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm start

# Production Build erstellen
npm run build
```

Die App läuft auf [http://localhost:3000](http://localhost:3000).

## Projektstruktur

```
src/
├── components/
│   ├── Layout/           # Header, Navigation, Layout
│   ├── Whiteboard/       # Canvas und ModelNode Komponenten
│   ├── Charts/           # KPI Cards, Cost/Inventory Charts
│   └── Recommendations/  # Recommendation Cards
├── screens/              # Hauptscreens (Goal, Task, Model, Insights)
├── context/              # React Context für State Management
├── types/                # TypeScript Definitionen
└── data/                 # Mock-Daten (JSON)
```

## Demo-Szenario

**Ausgangslage:** 20% Zollerhöhung auf Rohstoffe ab Oktober 2025  
**Ziel:** Produktionskosten minimieren im Q4 2025

Das System zeigt:
- Automatische Aufgabengenerierung aus dem Geschäftsziel
- Interaktive Modellierung mit Maschinen, Wartung, und Tarifen
- Datenbasierte Empfehlungen (Vorproduktion vs. Zollmehrkosten)
- Quantifizierte Einsparungen und Handlungsoptionen

## Design-Prinzipien

- **Enterprise-Look:** Sauberes, whitespace-reiches Design
- **Deutsche Sprache:** Alle Texte und Einheiten auf Deutsch
- **Accessibility:** Keyboard-Navigation und ARIA-Labels
- **Mobile-Ready:** Responsive Grid-System

## Lizenz

Demo-Projekt für Circonomit Hiring Challenge

---

*Erstellt mit [Create React App](https://github.com/facebook/create-react-app)*

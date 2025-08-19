'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Download, RotateCcw, Camera } from 'lucide-react';
import { useOntologyStore } from '../store';
import { CommandParser } from '../utils/parser';
import { downloadJSON, exportSelection, takeScreenshot } from '../utils/export';

interface ChatPanelProps {
  className?: string;
}

export default function ChatPanel({ className }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    ontology,
    messages,
    addMessage,
    addToCommandHistory,
    getLastCommand,
    highlightNodes,
    highlightEdges,
    highlightAttributes,
    clearHighlights,
    clearSelection,
    removeFromSelection,
    exportSelection: getSelection,
    setSelectedBlock,
    setAttributesDrawerOpen,
  } = useOntologyStore();

  const parser = ontology ? new CommandParser(ontology.blocks, ontology.edges, ontology.attributes) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processCommand = async (command: string) => {
    if (!parser || !ontology) {
      addMessage('Ontology not loaded yet. Please wait.', 'system');
      return;
    }

    setIsProcessing(true);
    addToCommandHistory(command);
    
    try {
      const parsed = parser.parse(command);
      
      // Handle special cases and context
      if (command.toLowerCase().includes('remove it') || command.toLowerCase().includes('delete it')) {
        const lastCommand = getLastCommand();
        if (lastCommand) {
          const lastParsed = parser.parse(lastCommand);
          parsed.entities = lastParsed.entities;
          parsed.action = 'remove';
        }
      }

      // Execute the parsed command
      switch (parsed.action) {
        case 'highlight':
          if (parsed.entities.blocks.length > 0) {
            highlightNodes(parsed.entities.blocks);
            addMessage(`Highlighted blocks: ${parsed.entities.blocks.join(', ')}`, 'system');
          }
          if (parsed.entities.edges.length > 0) {
            highlightEdges(parsed.entities.edges);
            addMessage(`Highlighted edges: ${parsed.entities.edges.join(', ')}`, 'system');
          }
          break;

        case 'show':
          if (parsed.entities.edges.length > 0) {
            highlightEdges(parsed.entities.edges);
            addMessage(`Showing edges: ${parsed.entities.edges.map(key => {
              const edge = ontology.edges.find(e => e.key === key);
              return edge ? `${edge.from} → ${edge.to}` : key;
            }).join(', ')}`, 'system');
          }
          break;

        case 'add':
          if (parsed.entities.attributes.length > 0) {
            // Find blocks that have these attributes
            const relevantBlocks = new Set<string>();
            for (const attrKey of parsed.entities.attributes) {
              const attr = ontology.attributes.find(a => a.key === attrKey);
              if (attr) {
                relevantBlocks.add(attr.blockId);
              }
            }
            
            if (relevantBlocks.size > 0) {
              const blockId = Array.from(relevantBlocks)[0];
              setSelectedBlock(blockId);
              setAttributesDrawerOpen(true);
              highlightAttributes(parsed.entities.attributes);
              
              addMessage(`Opened attributes for ${blockId} and highlighted: ${
                parsed.entities.attributes.map(key => {
                  const attr = ontology.attributes.find(a => a.key === key);
                  return attr ? attr.label : key;
                }).join(', ')
              }`, 'system');
            }
          }
          break;

        case 'remove':
          for (const blockId of parsed.entities.blocks) {
            removeFromSelection(blockId);
          }
          for (const edgeKey of parsed.entities.edges) {
            removeFromSelection(edgeKey);
          }
          for (const attrKey of parsed.entities.attributes) {
            removeFromSelection(attrKey);
          }
          addMessage(`Removed from selection: ${[
            ...parsed.entities.blocks,
            ...parsed.entities.edges,
            ...parsed.entities.attributes
          ].join(', ')}`, 'system');
          break;

        case 'export':
          const selectionData = getSelection();
          const exportData = exportSelection(
            selectionData.nodes,
            selectionData.edges,
            selectionData.attributes
          );
          
          downloadJSON(exportData);
          
          const summary = `Exported ${selectionData.nodes.length} nodes, ${selectionData.edges.length} edges, ${selectionData.attributes.length} attributes`;
          addMessage(`${summary}\n\`\`\`json\n${JSON.stringify(exportData, null, 2)}\n\`\`\``, 'system');
          break;

        case 'reset':
          clearHighlights();
          clearSelection();
          addMessage('Reset all highlights and selections', 'system');
          break;

        default:
          const disambig = parser.generateDisambiguation(parsed.entities);
          if (disambig) {
            addMessage(disambig, 'system');
          } else if (parsed.entities.blocks.length === 0 && parsed.entities.edges.length === 0 && parsed.entities.attributes.length === 0) {
            addMessage("I couldn't understand that command. Try commands like 'highlight product and supplier' or 'show edges from product to material'.", 'system');
          }
          break;
      }
    } catch (err) {
      addMessage('Error processing command. Please try again.', 'system');
      console.error('Command processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const command = input.trim();
    addMessage(command, 'user');
    setInput('');
    
    await processCommand(command);
  };

  const handleExport = () => {
    const selectionData = getSelection();
    const exportData = exportSelection(
      selectionData.nodes,
      selectionData.edges,
      selectionData.attributes
    );
    downloadJSON(exportData);
  };

  const handleScreenshot = async () => {
    try {
      await takeScreenshot('graph-canvas');
      addMessage('Screenshot saved!', 'system');
    } catch (err) {
      addMessage('Failed to take screenshot', 'system');
      console.error('Screenshot failed:', err);
    }
  };

  const handleReset = () => {
    clearHighlights();
    clearSelection();
    addMessage('Reset all highlights and selections', 'system');
  };

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-300 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Chat Interface</h2>
        <p className="text-sm text-gray-600">Ask about the ontology or use commands</p>
        
        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
            title="Reset all highlights and selections"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded text-blue-700"
            title="Export current selection"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
          <button
            onClick={handleScreenshot}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 hover:bg-green-200 rounded text-green-700"
            title="Take screenshot"
          >
            <Camera className="w-3 h-3" />
            Screenshot
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-sm text-gray-500">
            <p className="mb-2">Try these commands:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li>highlight product and supplier</li>
              <li>show edges from product to material</li>
              <li>add tariff rate and energy price to the view</li>
              <li>remove shipment from selection</li>
              <li>export current selection</li>
            </ul>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] p-3 rounded-lg text-sm
                ${message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {/* Handle code blocks in system messages */}
              {message.text.includes('```') ? (
                <div className="space-y-2">
                  {message.text.split('```').map((part, i) => (
                    <div key={i}>
                      {i % 2 === 0 ? (
                        <span>{part}</span>
                      ) : (
                        <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto">
                          <code>{part.replace(/^json\n/, '')}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span>{message.text}</span>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
              <Bot className="w-4 h-4 inline mr-2" />
              Processing command...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
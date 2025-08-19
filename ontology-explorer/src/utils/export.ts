import html2canvas from 'html2canvas';
import { Block, Edge, Attribute } from '../types';

export interface ExportData {
  nodes: Block[];
  edges: Edge[];
  attributes: Attribute[];
  meta: {
    exportedAt: string;
    version: string;
  };
}

export const exportSelection = (
  nodes: Block[],
  edges: Edge[],
  attributes: Attribute[]
): ExportData => {
  return {
    nodes,
    edges,
    attributes,
    meta: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };
};

export const downloadJSON = (data: ExportData, filename = 'selection.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const takeScreenshot = async (elementId: string, filename = 'graph-screenshot.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      logging: false,
      useCORS: true,
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Screenshot failed:', error);
    throw new Error('Failed to take screenshot');
  }
};
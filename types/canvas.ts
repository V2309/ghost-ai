import { Node, Edge } from '@xyflow/react';

export const NODE_COLORS = [
  { id: 'neutral', bg: '#1F1F1F', text: '#EDEDED', name: 'Neutral dark' },
  { id: 'blue', bg: '#10233D', text: '#52A8FF', name: 'Blue' },
  { id: 'purple', bg: '#2E1938', text: '#BF7AF0', name: 'Purple' },
  { id: 'orange', bg: '#331B00', text: '#FF990A', name: 'Orange' },
  { id: 'red', bg: '#3C1618', text: '#FF6166', name: 'Red' },
  { id: 'pink', bg: '#3A1726', text: '#F75F8F', name: 'Pink' },
  { id: 'green', bg: '#0F2E18', text: '#62C073', name: 'Green' },
  { id: 'teal', bg: '#062822', text: '#0AC7B4', name: 'Teal' },
] as const;

export type NodeColor = (typeof NODE_COLORS)[number];

export type CanvasNodeData = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  shape?: 'rectangle' | 'circle' | 'diamond' | 'pill' | 'cylinder' | 'hexagon';
};

export type CanvasNode = Node<CanvasNodeData, 'canvasNode'>;
export type CanvasEdgeData = {
  label?: string;
};

export type CanvasEdge = Edge<CanvasEdgeData, 'canvasEdge'>;

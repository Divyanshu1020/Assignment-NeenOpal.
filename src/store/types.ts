import { Node, Edge } from '@xyflow/react';

export interface NodeData {
  label: string;
  color: string;
  fontSize: number;
  [key: string]: unknown;
}

export interface GraphState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: string | null;
}

export interface HistoryAction {
  type: 'color' | 'fontSize' | 'position';
  nodeId: string;
  prev: string;
  next: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface HistoryState {
  past: HistoryAction[];
  present: number;
  future: HistoryAction[];
}

export interface RootState {
  graph: GraphState;
  history: HistoryState;
}
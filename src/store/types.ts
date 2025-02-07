import { Edge, Node } from "@xyflow/react";

export interface NodeData {
  label: string;
  color: string;
  fontSize: number;
  textColor: string;
  [key: string]: unknown;
}

export interface GraphState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: string | null;
}

export interface HistoryAction {
  type: "color" | "fontSize" | "position" | "textColor" | "addNewNode";
  nodeId: string;
  prev: string | number | undefined | Position | Node<NodeData> | null;
  next: string | number | undefined | Position | Node<NodeData> | null;
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

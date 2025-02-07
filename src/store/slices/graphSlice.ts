import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from '@xyflow/react';
import { GraphState, NodeData, Position } from '../types';

const generateInitialNodes = (): Node<NodeData>[] => {
  const nodes: Node<NodeData>[] = [];
  const radius = 200;
  const centerX = 400;
  const centerY = 300;

  for (let i = 0; i < 10; i++) {
    const angle = (i * 2 * Math.PI) / 10;
    nodes.push({
      id: `${i + 1}`,
      type: 'customNode',
      draggable: true,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      data: {
        label: `Node ${i + 1}`,
        color: '#ffffff',
        // bg: 'bg-[#ffffff]',
        textColor: '#000000',
        fontSize: 12,
      },
      style: {
        // background: '#000000',
        // fontSize: 14,
      },
    });
  }
  return nodes;
};

const generateInitialEdges = (): Edge[] => {
  const edges: Edge[] = [];
  for (let i = 1; i <= 10; i++) {
    edges.push({
      id: `e${i}-${i % 10 + 1}`,
      source: `${i}`,
      target: `${i % 10 + 1}`,
      animated: true,
    });
  }
  return edges;
};

const initialState: GraphState = {
  nodes: generateInitialNodes(),
  edges: [],
  selectedNode: null,
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node<NodeData>[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = action.payload;
    },
    updateNodeColor: (
      state,
      action: PayloadAction<{ nodeId: string; color: string; }>
    ) => {
      const node = state.nodes.find((n) => n.id === action.payload.nodeId);
      if (node) {
        node.data.color = action.payload.color;
        // node.style = { ...node.style, background: action.payload.color };
      }
    },
    updateNodeFontSize: (
      state,
      action: PayloadAction<{ nodeId: string; fontSize: number }>
    ) => {
      const node = state.nodes.find((n) => n.id === action.payload.nodeId);
      if (node) {
        node.data.fontSize = action.payload.fontSize;
        node.style = { ...node.style, fontSize: action.payload.fontSize };
      }
    },
    updateNodePosition: (
      state,
      action: PayloadAction<{ nodeId: string; position: Position }>
    ) => {
      const node = state.nodes.find((n) => n.id === action.payload.nodeId);
      if (node) {
        node.position = action.payload.position;
      }
    },
    updateNodeLabel: (state, action: PayloadAction<{ nodeId: string; label: string }>) => {
      const node = state.nodes.find((n) => n.id === action.payload.nodeId);
      if (node) {
        node.data.label = action.payload.label;
      }
    },
    updateNodeTextColor: (
      state,
      action: PayloadAction<{ nodeId: string; textColor: string }>
    ) => {
      const node = state.nodes.find((n) => n.id === action.payload.nodeId);
      if (node) {
        node.data.textColor = action.payload.textColor;
      }
    },
  },
});

export const {
  setNodes,
  setEdges,
  setSelectedNode,
  updateNodeColor,
  updateNodeFontSize,
  updateNodePosition,
  updateNodeLabel,
  updateNodeTextColor
} = graphSlice.actions;

export default graphSlice.reducer;
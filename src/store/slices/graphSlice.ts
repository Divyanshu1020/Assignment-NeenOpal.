import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from '@xyflow/react';
import { GraphState, NodeData, Position } from '../types';

const generateInitialNodes = (): Node<NodeData>[] => {
  const nodes: Node<NodeData>[] = [];
  const startX = 200; // Starting X position
  const startY = 200; // Starting Y position
  const gapX = 200; // Horizontal spacing
  const gapY = 150; // Vertical spacing

  for (let i = 0; i < 10; i++) {
    const row = Math.floor(i / 5); // 0 for first row, 1 for second row
    const col = i % 5; // Column index

    nodes.push({
      id: `${i + 1}`,
      type: 'customNode',
      draggable: true,
      position: {
        x: startX + col * gapX,
        y: startY + row * gapY,
      },
      data: {
        label: `Node ${i + 1}`,
        color: '#ffffff',
        textColor: '#000000',
        fontSize: 12,
      },
    });
  }

  return nodes;
};

const generateInitialEdges = (): Edge[] => {
  const edges: Edge[] = [];

  for (let i = 0; i < 10; i++) {
    const row = Math.floor(i / 5);
    const col = i % 5;

    // Horizontal connection (except last node in each row)
    if (col < 4) {
      edges.push({
        id: `e${i + 1}-${i + 2}`,
        source: `${i + 1}`,
        target: `${i + 2}`,
        animated: true,
      });
    }

    // Vertical connection (connect rows)
    if (row === 0) {
      edges.push({
        id: `e${i + 1}-${i + 6}`,
        source: `${i + 1}`,
        target: `${i + 6}`,
        animated: true,
      });
    }
  }

  return edges;
};


const initialState: GraphState = {
  nodes: generateInitialNodes(),
  edges: generateInitialEdges(),
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
    UpdateNodeAddNewNode: (state, action: PayloadAction<{ nodeId: string; node: Node<NodeData>  }>) => {
      if (action.payload.node === null) {
        state.nodes = state.nodes.filter((n) => n.id !== action.payload.nodeId);
      } else {
        state.nodes.push(action.payload.node);
      }
    },
    deleteNode: (state, action: PayloadAction<{ nodeId: string, node?: Node<NodeData> | null }>) => {
      if (action.payload.node === null){
        state.nodes = state.nodes.filter((n) => n.id !== action.payload.nodeId);
      } else if (action.payload.node !== undefined) {
        state.nodes.push(action.payload.node);
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
  updateNodeTextColor,
  UpdateNodeAddNewNode,
  deleteNode
} = graphSlice.actions;

export default graphSlice.reducer;
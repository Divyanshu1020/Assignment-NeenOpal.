import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './slices/graphSlice';
import historyReducer from './slices/historySlice';
import { RootState } from './types';

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    history: historyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export const selectNodes = (state: RootState) => state.graph.nodes;
export const selectEdges = (state: RootState) => state.graph.edges;
export const selectSelectedNode = (state: RootState) => state.graph.selectedNode;
export const selectHistory = (state: RootState) => state.history;
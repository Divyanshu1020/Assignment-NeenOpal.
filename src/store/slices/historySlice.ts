import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryState, HistoryAction } from '../types';
import { deleteNode, UpdateNodeAddNewNode, updateNodeColor, updateNodeFontSize, updateNodeLabel, updateNodePosition, updateNodeTextColor } from './graphSlice';
import { AppDispatch } from '../store';

const initialState: HistoryState = {
  past: [],
  present: -1,
  future: [],
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryAction: (state, action: PayloadAction<HistoryAction>) => {
      state.past = [...state.past.slice(0, state.present + 1), action.payload]; 
      state.present = state.past.length - 1; 
      state.future = []; // Clear redo history because a new action invalidates redo steps
    },
    undo: (state) => {
      if (state.present >= 0) {
        state.future = [state.past[state.present], ...state.future]; // Store undone action
        state.present -= 1;
      }
    },
    
    redo: (state) => {
      if (state.future.length > 0) {
        state.present += 1;
        state.future.shift(); // Remove action from future since we're redoing it
      }
    }
  },
});

export const { addHistoryAction, undo, redo } = historySlice.actions;

export const handleUndo = () => (dispatch: AppDispatch, getState: () => any) => {
  const state = getState();
  const { past, present } = state.history;

  if (present >= 0) {
    const action = past[present];
    switch (action.type) {
      case 'color':
        dispatch(updateNodeColor({ nodeId: action.nodeId, color: action.prev }));
        break;
      case 'fontSize':
        dispatch(updateNodeFontSize({ nodeId: action.nodeId, fontSize: action.prev }));
        break;
      case 'position':
        dispatch(updateNodePosition({ nodeId: action.nodeId, position: action.prev }));
        break;
      case 'textColor':
        dispatch(updateNodeTextColor({ nodeId: action.nodeId, textColor: action.prev }));
        break;
      case 'addNewNode':
        dispatch(UpdateNodeAddNewNode({ nodeId: action.nodeId, node: action.prev }));
        break;
      case 'deleteNode':
        dispatch(deleteNode({ nodeId: action.nodeId, node: action.prev }));
        break;
      case 'label':
        dispatch(updateNodeLabel({ nodeId: action.nodeId, label: action.prev }));
        break;
    }
    dispatch(undo());
  }
};


/**
 * Redoes the last undone action from the history.
 *
 * This function checks if there are any actions available in the future
 * history. If so, it retrieves the next action and re-applies it to the
 * graph state by dispatching the corresponding update action based on
 * the action type ('color', 'fontSize', or 'position'). After applying
 * the redo action, it updates the history state by dispatching the redo
 * action.
 *
 * Preconditions:
 * - The future history must have at least one action to redo.
 *
 * Effects:
 * - Updates node properties (color, font size, position) based on the
 *   redone action.
 * - Modifies the history state to reflect the redone action.
 */

export const handleRedo = () => (dispatch: AppDispatch, getState: () => any) => {
  const state = getState();
  const { past, present, future } = state.history;

  if (future.length > 0) {
    const action = past[present + 1]; // Use action from history
    switch (action.type) {
      case 'color':
        dispatch(updateNodeColor({ nodeId: action.nodeId, color: action.next }));
        break;
      case 'fontSize':
        dispatch(updateNodeFontSize({ nodeId: action.nodeId, fontSize: action.next }));
        break;
      case 'position':
        dispatch(updateNodePosition({ nodeId: action.nodeId, position: action.next }));
        break;
      case 'textColor':
        dispatch(updateNodeTextColor({ nodeId: action.nodeId, textColor: action.next }));
        break;
      case 'addNewNode':
        dispatch(UpdateNodeAddNewNode({ nodeId: action.nodeId, node: action.next }));
        break;
      case 'deleteNode':
        dispatch(deleteNode({ nodeId: action.nodeId, node: action.next }));
        break;
      case 'label':
        dispatch(updateNodeLabel({ nodeId: action.nodeId, label: action.next }));
        break;
    }
    dispatch(redo());
  }
};


export default historySlice.reducer;
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Undo2, Redo2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNodes, selectSelectedNode } from '../store/store';
import { updateNodeColor, updateNodeFontSize } from '../store/slices/graphSlice';
import { addHistoryAction, handleUndo, handleRedo } from '../store/slices/historySlice';

const fontSizes = [12, 14, 16, 18, 20, 22, 24];

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector(selectSelectedNode);
  const nodes = useSelector(selectNodes);

  const selectedNodeData = selectedNode
    ? nodes.find((n) => n.id === selectedNode)?.data
    : null;

  const handleColorChange = (color: string) => {
    if (selectedNode) {
      const prevColor = nodes.find((n) => n.id === selectedNode)?.data.color;
      dispatch(updateNodeColor({ nodeId: selectedNode, color }));
      dispatch(
        addHistoryAction({
          type: 'color',
          nodeId: selectedNode,
          prev: prevColor,
          next: color,
        })
      );
    }
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (selectedNode) {
      const prevFontSize = nodes.find((n) => n.id === selectedNode)?.data.fontSize;
      dispatch(updateNodeFontSize({ nodeId: selectedNode, fontSize }));
      dispatch(
        addHistoryAction({
          type: 'fontSize',
          nodeId: selectedNode,
          prev: prevFontSize,
          next: fontSize,
        })
      );
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-64 bg-white p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Node Editor</h2>
        <p className="text-gray-500">Select a node to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white p-4 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Node Editor</h2>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(handleUndo())}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Undo"
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={() => dispatch(handleRedo())}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Redo"
          >
            <Redo2 size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node Color
          </label>
          <HexColorPicker
            color={selectedNodeData?.color}
            onChange={handleColorChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                className={`px-2 py-1 rounded ${
                  selectedNodeData?.fontSize === size
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
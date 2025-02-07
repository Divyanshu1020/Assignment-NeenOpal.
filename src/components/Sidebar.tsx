import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Undo2, Redo2, X, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectNodes, selectSelectedNode } from "../store/store";
import {
  updateNodeColor,
  updateNodeFontSize,
  updateNodeTextColor,
} from "../store/slices/graphSlice";
import {
  addHistoryAction,
  handleUndo,
  handleRedo,
} from "../store/slices/historySlice";

const fontSizes = [12, 14, 16, 18, 20, 22, 24];

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector(selectSelectedNode);
  const nodes = useSelector(selectNodes);
  const [activeTab, setActiveTab] = useState<"bg" | "text">("bg");
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state

  const selectedNodeData = selectedNode
    ? nodes.find((n) => n.id === selectedNode)?.data
    : null;

  const handleColorChange = (color: string) => {
    if (selectedNode) {
      const prevColor = selectedNodeData?.color;
      dispatch(updateNodeColor({ nodeId: selectedNode, color }));
      dispatch(
        addHistoryAction({
          type: "color",
          nodeId: selectedNode,
          prev: prevColor,
          next: color,
        })
      );
    }
  };

  const handleTextColorChange = (color: string) => {
    if (selectedNode) {
      const prevTextColor = selectedNodeData?.textColor;
      dispatch(updateNodeTextColor({ nodeId: selectedNode, textColor: color }));
      dispatch(
        addHistoryAction({
          type: "textColor",
          nodeId: selectedNode,
          prev: prevTextColor,
          next: color,
        })
      );
    }
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (selectedNode) {
      const prevFontSize = selectedNodeData?.fontSize;
      dispatch(updateNodeFontSize({ nodeId: selectedNode, fontSize }));
      dispatch(
        addHistoryAction({
          type: "fontSize",
          nodeId: selectedNode,
          prev: prevFontSize,
          next: fontSize,
        })
      );
    }
  };

  return (
    <>
      {/* Toggle Button for Mobile (Right Side) */}
      <button
        onClick={() => setIsOpen(true)}
        className={` ${isOpen ? "hidden" : ""} fixed top-4 right-4 z-50 md:hidden p-2 bg-gray-800 text-white rounded-md shadow-md`}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`z-50 fixed top-0 right-0 h-full w-64 bg-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"} md:relative md:translate-x-0 md:w-64`}
      >
        {/* Close Button for Mobile */}
        {/* <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 left-3 md:hidden text-gray-600 hover:text-black"
        >
          <X size={24} />
        </button> */}

        {/* Header with Undo/Redo */}
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

        {/* Tabs for Background & Text Color */}
        <div className="flex border-b">
          <button
            className={`flex-1 text-center py-2 ${
              activeTab === "bg"
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("bg")}
          >
            Background Color
          </button>
          <button
            className={`flex-1 text-center py-2 ${
              activeTab === "text"
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("text")}
          >
            Text Color
          </button>
        </div>

        {/* Color Picker */}
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {activeTab === "bg" ? "Node Background Color" : "Node Text Color"}
          </label>
          <HexColorPicker
            color={activeTab === "bg" ? selectedNodeData?.color : selectedNodeData?.textColor}
            onChange={activeTab === "bg" ? handleColorChange : handleTextColorChange}
            className="w-full"
          />
        </div>

        {/* Font Size Selector */}
        <div className="mt-4">
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
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

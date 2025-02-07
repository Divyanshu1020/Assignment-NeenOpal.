import { memo, useCallback, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { Check } from "lucide-react"; // Import tick icon
import { updateNodeLabel } from "../store/slices/graphSlice";
import { NodeData } from "../store/types";

const CustomNode = ({ id, data }: NodeProps<Node<NodeData>>) => {
  const dispatch = useDispatch();
  const [labelText, setLabelText] = useState(data.label);
  const [isEditing, setIsEditing] = useState(false);

  // Handle text input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(event.target.value);
    setIsEditing(true); // Show confirm tick
  };

  // Handle confirm update (Enter key or tick click)
  const handleConfirm = useCallback(() => {
    if (labelText.trim() !== data.label) {
      dispatch(updateNodeLabel({ nodeId: id, label: labelText.trim() }));
    }
    setIsEditing(false);
  }, [dispatch, id, labelText, data.label]);

  // Handle cancel (Escape key or clicking outside)
  const handleCancel = useCallback(() => {
    setLabelText(data.label); // Reset input
    setIsEditing(false);
  }, [data.label]);

  // Handle keyboard actions
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleConfirm();
    if (event.key === "Escape") handleCancel();
  };

  return (
    <div
      style={{ backgroundColor: data.color, fontSize: data.fontSize }}
      className="p-2 rounded-xl shadow-md relative flex items-center gap-2"
    >
      {/* Floating Handles for Connections */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      {/* Editable Text Input */}
      <input
        type="text"
        value={labelText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleCancel} // Reset if clicked outside
        className="border-none outline-none text-xs text-center w-full bg-transparent rounded-lg"
        style={{ fontSize: data.fontSize, color: data.textColor }}
      />

      {/* Confirmation Tick (Visible only when editing) */}
      {isEditing && (
        <button
          onClick={handleConfirm}
          className="text-green-600 hover:text-green-800 transition"
        >
          <Check size={18} />
        </button>
      )}
    </div>
  );
};

export default memo(CustomNode);

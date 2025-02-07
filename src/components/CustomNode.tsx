import { memo, useCallback } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { updateNodeLabel } from "../store/slices/graphSlice";
import { NodeData } from "../store/types";

const CustomNode = ({ id, data }: NodeProps<Node<NodeData>>) => {
  const dispatch = useDispatch();

  // Handle text change
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateNodeLabel({ nodeId: id, label: event.target.value }));
    },
    [dispatch, id]
  );

  return (
    <div className="border p-2 rounded-md bg-transparent shadow-md">
      <Handle type="target" position={Position.Top} />
      
      {/* Editable Text Input */}
      <input
        type="text"
        value={data.label}
        onChange={handleChange}
        className="border-none outline-none text-center font-bold w-full bg-transparent"
      />

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);

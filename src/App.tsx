import {
  addEdge,
  Background,
  Connection,
  Controls,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sidebar } from "./components/Sidebar";
import {
  setEdges,
  setSelectedNode,
  updateNodePosition,
} from "./store/slices/graphSlice";
import { addHistoryAction } from "./store/slices/historySlice";
import { selectEdges, selectNodes } from "./store/store";
import CustomNode from "./components/CustomNode";

export default function App() {
  const dispatch = useDispatch();
  const reduxNodes = useSelector(selectNodes);
  const reduxEdges = useSelector(selectEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(reduxNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(reduxEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge({ ...params , animated: true}, edges);
      setEdgesState(newEdges); // Update local state first
      dispatch(setEdges(newEdges)); // Then update Redux
    },
    [edges, setEdgesState, dispatch]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(setSelectedNode(node.id));
    },
    [dispatch]
  );

  const onNodeDragStart = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(setSelectedNode(node.id));
    },
    [dispatch]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const prevPosition = reduxNodes.find((n) => n.id === node.id)?.position;
      if (prevPosition) {
        // const updatedNodes = nodes.map((n) =>
        //   n.id === node.id ? { ...n, position: node.position } : n
        // );
        // setNodes(updatedNodes);

        dispatch(
          updateNodePosition({ nodeId: node.id, position: node.position })
        );
        dispatch(
          addHistoryAction({
            type: "position",
            nodeId: node.id,
            prev: prevPosition,
            next: node.position,
          })
        );
      }
    },
    [reduxNodes, dispatch]
  );

  const nodeTypes = { customNode: CustomNode };

  useEffect(() => {
    setNodes([...reduxNodes]);
  }, [reduxNodes, setNodes]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          
          <Background gap={12} size={1} />

        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

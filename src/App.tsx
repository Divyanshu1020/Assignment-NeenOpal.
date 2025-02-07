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
import CustomNode from "./components/CustomNode";
import { Sidebar } from "./components/Sidebar";
import {
  setEdges,
  setNodes,
  setSelectedNode,
  updateNodePosition,
} from "./store/slices/graphSlice";
import { addHistoryAction } from "./store/slices/historySlice";
import { selectEdges, selectNodes } from "./store/store";
import { NodeData } from "./store/types";

export default function App() {
  const dispatch = useDispatch();
  const reduxNodes = useSelector(selectNodes);
  const reduxEdges = useSelector(selectEdges);

  const [nodes, setNodesState, onNodesChange] = useNodesState(reduxNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(reduxEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge({ ...params, animated: true }, edges);
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

  const handleAddNewNode = () => {
    const newNode: Node<NodeData> = {
      id: `node-${Date.now()}`,
      type: "customNode",
      position: { x: 300, y: 300 },
      data: { 
        label: "New Node",
        color: "#ffffff",
        textColor: "#000000",
        fontSize: 12
       },
    };
    setNodesState([...nodes, newNode]);
    dispatch(setNodes([...nodes, newNode]));
    dispatch(setSelectedNode(newNode.id));
    dispatch(
      addHistoryAction({
        type: "addNewNode",
        nodeId: newNode.id,
        prev: null, // No previous state (node didn't exist)
        next: newNode, // Store new node details
      })
    );
  }

  const nodeTypes = { customNode: CustomNode };

  useEffect(() => {
    setNodesState([...reduxNodes]);
  }, [reduxNodes, setNodesState]);

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
          <div className="update-node__controls">
            <button
              onClick={handleAddNewNode} 
              className=" text-nowrap px-4 py-3 bg-black text-white rounded-2xl text-lg">
              Add New Node
            </button>
          </div>

          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

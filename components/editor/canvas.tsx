"use client";

import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { 
  ReactFlow, 
  Background, 
  BackgroundVariant,
  ConnectionMode,
  ReactFlowProvider,
  useReactFlow,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
import { CanvasNode, CanvasEdge } from "@/types/canvas";
import { ShapePanel } from "./shape-panel";
import { useCallback } from "react";
import { CanvasNode as CanvasNodeComponent } from "./nodes/canvas-node";
import { CanvasEdge as CanvasEdgeComponent } from "./edges/canvas-edge";
import { useMutation } from "@liveblocks/react";
import { LiveObject } from "@liveblocks/client";
import { CanvasControlBar } from "./canvas-control-bar";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
};

const edgeTypes = {
  canvasEdge: CanvasEdgeComponent,
};

const defaultEdgeOptions = {
  type: "canvasEdge",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: "var(--color-muted-foreground)",
  },
};

function CanvasInner() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
  } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
    storageKey: "flow",
  });

  const onConnect = useMutation(({ storage }, connection) => {
    const flow = storage.get("flow");
    if (!flow) return;
    
    const edges = flow.get("edges");
    const edgeId = `edge-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const newEdge = new LiveObject({
      id: edgeId,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: "canvasEdge",
      data: new LiveObject({ label: "" }),
    });
    
    edges.set(edgeId, newEdge as any);
  }, []);

  const { screenToFlowPosition } = useReactFlow();


  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const payload = JSON.parse(data);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CanvasNode = {
        id: `${payload.shape}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: payload.type,
        position,
        data: {
          label: "",
          shape: payload.shape,
        },
        style: {
          width: payload.width,
          height: payload.height,
        },
      };

      // Add the node via onNodesChange
      onNodesChange([{ type: "add", item: newNode }]);
    },
    [screenToFlowPosition, onNodesChange]
  );

  useKeyboardShortcuts();

  return (
    <div 
      className="h-full w-full bg-background overflow-hidden relative"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        connectionMode={ConnectionMode.Loose}
        connectionRadius={30}
        colorMode="dark"
        className="!bg-transparent"
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          className="opacity-40"
          color="hsl(var(--muted-foreground))"
        />
        <Cursors />
      </ReactFlow>
      
      <CanvasControlBar />
      <ShapePanel />
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}

"use client";

import { Handle, Position, NodeProps, NodeResizer } from "@xyflow/react";
import { CanvasNodeData } from "@/types/canvas";
import { cn } from "@/lib/utils";
import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation } from "@liveblocks/react";
import { NodeColorToolbar } from "./node-color-toolbar";

export function CanvasNode({ id, data, selected }: NodeProps & { data: CanvasNodeData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const shape = data.shape || "rectangle";
  const backgroundColor = data.backgroundColor || "#1F1F1F";
  const textColor = data.textColor || "#EDEDED";

  // Mutation to update the node label in Liveblocks storage
  const updateLabel = useMutation(({ storage }, newLabel: string) => {
    const flow = storage.get("flow");
    if (!flow) return;
    
    const nodes = flow.get("nodes");
    const node = nodes.get(id);
    
    if (node) {
      const data = node.get("data");
      data.set("label", newLabel);
    }
  }, [id]);

  // Mutation to update both background and text colors
  const updateColors = useMutation(({ storage }, bg: string, text: string) => {
    const flow = storage.get("flow");
    if (!flow) return;
    
    const nodes = flow.get("nodes");
    const node = nodes.get(id);
    
    if (node) {
      const data = node.get("data");
      data.set("backgroundColor", bg);
      data.set("textColor", text);
    }
  }, [id]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setTempLabel(data.label);
  }, [data.label]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (tempLabel !== data.label) {
      updateLabel(tempLabel);
    }
  }, [tempLabel, data.label, updateLabel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setTempLabel(data.label);
      setIsEditing(false);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  }, [data.label, handleBlur]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const renderShape = () => {
    const commonClasses = cn(
      "w-full h-full transition-all duration-200 drop-shadow-sm",
      selected ? "ring-2 ring-primary/20" : ""
    );

    const strokeClass = selected ? "stroke-primary stroke-[2px]" : "stroke-zinc-800 stroke-[1.5px]";
    const borderClass = selected ? "border-primary border-2" : "border-zinc-800 border-[1.5px]";

    switch (shape) {
      case "rectangle":
        return (
          <div
            className={cn(commonClasses, borderClass, "rounded-lg")}
            style={{ backgroundColor: backgroundColor }}
          />
        );
      case "pill":
        return (
          <div
            className={cn(commonClasses, borderClass, "rounded-full")}
            style={{ backgroundColor: backgroundColor }}
          />
        );
      case "circle":
        return (
          <div
            className={cn(commonClasses, borderClass, "rounded-full")}
            style={{ backgroundColor: backgroundColor }}
          />
        );
      case "diamond":
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={commonClasses}>
            <path
              d="M 50 2 L 98 50 L 50 98 L 2 50 Z"
              fill={backgroundColor}
              className={strokeClass}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        );
      case "hexagon":
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={commonClasses}>
            <path
              d="M 25 2 L 75 2 L 98 50 L 75 98 L 25 98 L 2 50 Z"
              fill={backgroundColor}
              className={strokeClass}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        );
      case "cylinder":
        return (
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={commonClasses}>
            <path
              d="M 2 15 V 85 A 48 15 0 0 0 98 85 V 15 A 48 15 0 0 0 2 15 Z"
              fill={backgroundColor}
              className={strokeClass}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 2 15 A 48 15 0 0 1 98 15"
              fill="none"
              className={strokeClass}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative w-full h-full min-w-[60px] min-h-[60px] group"
      onDoubleClick={handleDoubleClick}
    >
      <NodeResizer 
        isVisible={selected} 
        minWidth={60} 
        minHeight={60}
        handleClassName="!w-2 !h-2 !bg-primary !border-background !border-2 !rounded-sm transition-opacity"
        lineClassName="!border-primary/40"
      />

      {renderShape()}
      
      <div className="absolute inset-0 flex items-center justify-center p-3">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="w-full h-full bg-transparent text-sm font-medium text-center resize-none outline-none border-none p-0 flex items-center justify-center placeholder:text-zinc-500 nodrag nopan"
            style={{ color: textColor }}
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Type something..."
          />
        ) : (
          <span 
            className="text-sm font-medium text-center break-words select-none pointer-events-none"
            style={{ color: textColor }}
          >
            {data.label || <span className="opacity-50" style={{ color: textColor }}>Label</span>}
          </span>
        )}
      </div>

      {/* Handles */}
      <Handle 
        id="top"
        type="source" 
        position={Position.Top} 
        className={cn(
          "w-3 h-3 !bg-white rounded-full border-2 border-zinc-950 transition-all opacity-0 group-hover:opacity-100 z-50 hover:scale-125 hover:!bg-primary hover:!border-primary !p-0",
          selected && "opacity-100"
        )} 
        style={{ backgroundColor: '#FFFFFF', cursor: 'crosshair' }}
      />
      <Handle 
        id="bottom"
        type="source" 
        position={Position.Bottom} 
        className={cn(
          "w-3 h-3 !bg-white rounded-full border-2 border-zinc-950 transition-all opacity-0 group-hover:opacity-100 z-50 hover:scale-125 hover:!bg-primary hover:!border-primary !p-0",
          selected && "opacity-100"
        )} 
        style={{ backgroundColor: '#FFFFFF', cursor: 'crosshair' }}
      />
      <Handle 
        id="left"
        type="source" 
        position={Position.Left} 
        className={cn(
          "w-3 h-3 !bg-white rounded-full border-2 border-zinc-950 transition-all opacity-0 group-hover:opacity-100 z-50 hover:scale-125 hover:!bg-primary hover:!border-primary !p-0",
          selected && "opacity-100"
        )} 
        style={{ backgroundColor: '#FFFFFF', cursor: 'crosshair' }}
      />
      <Handle 
        id="right"
        type="source" 
        position={Position.Right} 
        className={cn(
          "w-3 h-3 !bg-white rounded-full border-2 border-zinc-950 transition-all opacity-0 group-hover:opacity-100 z-50 hover:scale-125 hover:!bg-primary hover:!border-primary !p-0",
          selected && "opacity-100"
        )} 
        style={{ backgroundColor: '#FFFFFF', cursor: 'crosshair' }}
      />

      {/* Color Toolbar */}
      {selected && !isEditing && (
        <NodeColorToolbar 
          onColorSelect={updateColors} 
          currentBg={backgroundColor} 
        />
      )}
    </div>
  );
}

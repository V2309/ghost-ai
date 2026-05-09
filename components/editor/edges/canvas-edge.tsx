"use client";

import { 
  BaseEdge, 
  EdgeLabelRenderer, 
  EdgeProps, 
  getSmoothStepPath,
} from "@xyflow/react";
import { CanvasEdgeData } from "@/types/canvas";
import { cn } from "@/lib/utils";
import { useMutation } from "@liveblocks/react";
import { useCallback, useState, useRef, useEffect } from "react";

export function CanvasEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps & { data?: CanvasEdgeData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tempLabel, setTempLabel] = useState(data?.label || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
  });

  // Mutation to update the edge label in Liveblocks storage
  const updateLabel = useMutation(({ storage }, newLabel: string) => {
    const flow = storage.get("flow");
    if (!flow) return;
    
    const edges = flow.get("edges");
    const edge = edges.get(id);
    
    if (edge) {
      const data = edge.get("data");
      // Ensure data is initialized if it doesn't exist
      if (!data) {
        // This shouldn't happen with our types but good for safety
        return;
      }
      data.set("label", newLabel);
    }
  }, [id]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTempLabel(data?.label || "");
  }, [data?.label]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (tempLabel !== (data?.label || "")) {
      updateLabel(tempLabel);
    }
  }, [tempLabel, data?.label, updateLabel]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
    if (e.key === "Escape") {
      setTempLabel(data?.label || "");
      setIsEditing(false);
    }
  }, [data?.label, handleBlur]);

  // Sync temp label with remote data when not editing
  useEffect(() => {
    if (!isEditing) {
      setTempLabel(data?.label || "");
    }
  }, [data?.label, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 2.5,
          stroke: (selected || isHovered) ? "var(--color-primary)" : "var(--color-muted-foreground)",
          opacity: (selected || isHovered) ? 1 : 0.3,
          transition: "stroke 0.2s ease, opacity 0.2s ease",
        }} 
      />
      {/* Invisible wider path for easier interaction */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <div className="bg-background border border-primary rounded-md shadow-xl p-1 min-w-[80px] animate-in zoom-in-95 duration-100">
              <input
                ref={inputRef}
                className="w-full bg-transparent border-none px-1 text-xs outline-none text-foreground text-center"
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="Label..."
                style={{
                  width: `${Math.max(60, tempLabel.length * 7)}px`,
                }}
              />
            </div>
          ) : (
            <div 
              onDoubleClick={handleDoubleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-text select-none",
                data?.label 
                  ? "bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 text-zinc-300 shadow-sm" 
                  : (selected || isHovered)
                    ? "bg-primary/10 border border-dashed border-primary/30 text-primary/60 opacity-100" 
                    : "opacity-0"
              )}
            >
              {data?.label || ((selected || isHovered) ? "Add label" : "")}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

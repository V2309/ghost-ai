"use client";

import { 
  Square, 
  Diamond, 
  Circle, 
  Pill, 
  Database, 
  Hexagon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const SHAPES = [
  {
    id: "rectangle",
    icon: Square,
    label: "Rectangle",
    defaultWidth: 150,
    defaultHeight: 100,
  },
  {
    id: "diamond",
    icon: Diamond,
    label: "Diamond",
    defaultWidth: 120,
    defaultHeight: 120,
  },
  {
    id: "circle",
    icon: Circle,
    label: "Circle",
    defaultWidth: 100,
    defaultHeight: 100,
  },
  {
    id: "pill",
    icon: Pill,
    label: "Pill",
    defaultWidth: 160,
    defaultHeight: 60,
  },
  {
    id: "cylinder",
    icon: Database,
    label: "Cylinder",
    defaultWidth: 100,
    defaultHeight: 120,
  },
  {
    id: "hexagon",
    icon: Hexagon,
    label: "Hexagon",
    defaultWidth: 120,
    defaultHeight: 110,
  },
];

export function ShapePanel() {
  const onDragStart = (event: React.DragEvent, shape: typeof SHAPES[0]) => {
    const payload = {
      type: "canvasNode",
      shape: shape.id,
      width: shape.defaultWidth,
      height: shape.defaultHeight,
    };
    
    event.dataTransfer.setData("application/reactflow", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "move";
    
    // Create ghost preview
    const ghost = document.createElement("div");
    ghost.style.width = `${shape.defaultWidth}px`;
    ghost.style.height = `${shape.defaultHeight}px`;
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";
    ghost.style.left = "-1000px";
    ghost.style.zIndex = "-1";
    ghost.style.pointerEvents = "none";
    ghost.style.opacity = "0.8";

    const isCssShape = ["rectangle", "pill", "circle"].includes(shape.id);
    
    if (isCssShape) {
      ghost.style.border = "2px solid #3b82f6"; // primary color hex for ghost
      ghost.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      if (shape.id === "pill" || shape.id === "circle") {
        ghost.style.borderRadius = "9999px";
      } else {
        ghost.style.borderRadius = "8px";
      }
    } else {
      let path = "";
      if (shape.id === "diamond") path = "M 50 2 L 98 50 L 50 98 L 2 50 Z";
      else if (shape.id === "hexagon") path = "M 25 2 L 75 2 L 98 50 L 75 98 L 25 98 L 2 50 Z";
      else if (shape.id === "cylinder") {
        path = "M 2 15 V 85 A 48 15 0 0 0 98 85 V 15 A 48 15 0 0 0 2 15 Z M 2 15 A 48 15 0 0 1 98 15";
      }
      
      ghost.innerHTML = `
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%; height:100%">
          <path d="${path}" fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" stroke-width="2" />
        </svg>
      `;
    }

    document.body.appendChild(ghost);
    event.dataTransfer.setDragImage(ghost, shape.defaultWidth / 2, shape.defaultHeight / 2);
    
    // Cleanup ghost after the drag has started
    setTimeout(() => {
      document.body.removeChild(ghost);
    }, 0);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1.5 bg-background/80 backdrop-blur-md border border-border rounded-full shadow-2xl">
        <TooltipProvider delayDuration={0}>
          {SHAPES.map((shape) => (
            <Tooltip key={shape.id}>
              <TooltipTrigger asChild>
                <div
                  draggable
                  onDragStart={(e) => onDragStart(e, shape)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  >
                    <shape.icon className="h-5 w-5" />
                    <span className="sr-only">{shape.label}</span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800">
                <p>{shape.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}

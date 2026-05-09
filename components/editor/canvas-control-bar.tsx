"use client";

import { 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useReactFlow } from "@xyflow/react";
import { useHistory, useCanUndo, useCanRedo } from "@liveblocks/react";
import { Separator } from "@/components/ui/separator";

export function CanvasControlBar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  return (
    <div className="absolute bottom-6 left-6 z-50">
      <div className="flex items-center gap-1 p-1.5 bg-background/80 backdrop-blur-md border border-border rounded-full shadow-2xl">
        <TooltipProvider delayDuration={0}>
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  onClick={() => zoomOut({ duration: 300 })}
                >
                  <ZoomOut className="h-4 w-4" />
                  <span className="sr-only">Zoom Out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800">
                <p>Zoom Out (-)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  onClick={() => fitView({ duration: 300 })}
                >
                  <Maximize className="h-4 w-4" />
                  <span className="sr-only">Fit View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800">
                <p>Fit View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                  onClick={() => zoomIn({ duration: 300 })}
                >
                  <ZoomIn className="h-4 w-4" />
                  <span className="sr-only">Zoom In</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800">
                <p>Zoom In (+)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1 bg-border/50" />

          {/* History Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!canUndo}
                  className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  onClick={() => history.undo()}
                >
                  <Undo2 className="h-4 w-4" />
                  <span className="sr-only">Undo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800">
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={!canRedo}
                  className="h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                  onClick={() => history.redo()}
                >
                  <Redo2 className="h-4 w-4" />
                  <span className="sr-only">Redo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-zinc-900 text-white border-zinc-800">
                <p>Redo (Ctrl+Shift+Z)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

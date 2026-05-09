"use client";

import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { useHistory } from "@liveblocks/react";

export function useKeyboardShortcuts() {
  const { zoomIn, zoomOut } = useReactFlow();
  const history = useHistory();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if typing in an input, textarea, or contentEditable element
      const activeElement = document.activeElement;
      const isInput = 
        activeElement instanceof HTMLInputElement || 
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement && activeElement.isContentEditable);

      if (isInput) return;

      const isMod = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;

      // Undo: Cmd/Ctrl + Z
      if (isMod && !isShift && event.key.toLowerCase() === "z") {
        event.preventDefault();
        history.undo();
        return;
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (
        (isMod && isShift && event.key.toLowerCase() === "z") ||
        (isMod && event.key.toLowerCase() === "y")
      ) {
        event.preventDefault();
        history.redo();
        return;
      }

      // Zoom In: + or =
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomIn({ duration: 300 });
        return;
      }

      // Zoom Out: -
      if (event.key === "-") {
        event.preventDefault();
        zoomOut({ duration: 300 });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomIn, zoomOut, history]);
}

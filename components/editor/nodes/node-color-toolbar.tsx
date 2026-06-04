'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { NODE_COLORS } from '@/types/canvas';

interface NodeColorToolbarProps {
  onColorSelect: (bg: string, text: string) => void;
  currentBg?: string;
}

export function NodeColorToolbar({ onColorSelect, currentBg }: NodeColorToolbarProps) {
  return (
    <div 
      className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-xl bg-elevated border border-subtle shadow-xl nodrag nopan pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {NODE_COLORS.map((color) => {
        const isActive = currentBg === color.bg || (!currentBg && color.id === 'neutral');
        
        return (
          <button
            key={color.id}
            onClick={() => onColorSelect(color.bg, color.text)}
            className={cn(
              "w-6 h-6 rounded-lg transition-all duration-200 relative group",
              "hover:scale-110 active:scale-95",
              isActive ? "ring-2 ring-offset-2 ring-offset-elevated ring-white scale-110" : "hover:ring-1 hover:ring-white/50"
            )}
            style={{ 
              backgroundColor: color.bg,
            }}
            title={color.name}
          >
            {/* Subtle glow on hover */}
            <div 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 blur-[4px] transition-opacity duration-200 -z-10"
              style={{ backgroundColor: color.text }}
            />
          </button>
        );
      })}
    </div>
  );
}

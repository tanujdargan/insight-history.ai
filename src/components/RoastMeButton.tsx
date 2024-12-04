import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../utils/cn';
import RoastDialog from './RoastDialog';

export default function RoastMeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8",
          "px-6 py-3 rounded-full",
          "bg-gradient-to-r from-orange-500 to-red-500",
          "hover:from-orange-600 hover:to-red-600",
          "text-white font-semibold",
          "flex items-center gap-2",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-200",
          "transform hover:scale-105",
          "z-50"
        )}
      >
        <Flame className="w-5 h-5" />
        Roast Me!
      </button>
      <RoastDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
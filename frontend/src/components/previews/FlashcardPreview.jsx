import { useState } from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function FlashcardPreview() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl p-8 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Flashcards</span>
        </div>
        <span className="text-xs text-secondary">1/3</span>
      </div>
      
      <div 
        className="w-full h-64 [perspective:1000px] cursor-pointer"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <div className="absolute w-full h-full [backface-visibility:hidden] bg-elevated border border-border rounded-xl flex flex-col items-center justify-center p-6">
            <span className="text-xs text-secondary uppercase tracking-wider mb-4">Question</span>
            <p className="text-xl text-primary text-center font-medium">What is wave-particle duality?</p>
            <span className="absolute bottom-4 text-xs text-accent">Tap to reveal answer</span>
          </div>
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-accent border border-accent rounded-xl flex flex-col items-center justify-center p-6">
            <span className="text-xs text-white/70 uppercase tracking-wider mb-4">Answer</span>
            <p className="text-xl text-white text-center">The concept that every particle or quantum entity may be described as either a particle or a wave.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mt-8">
        <button className="p-2 rounded-full border border-border hover:bg-elevated transition-colors">
          <ChevronLeft className="h-4 w-4 text-secondary" />
        </button>
        <button className="p-2 rounded-full border border-border hover:bg-elevated transition-colors">
          <ChevronRight className="h-4 w-4 text-secondary" />
        </button>
      </div>
    </div>
  );
}
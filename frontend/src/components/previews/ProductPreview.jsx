import { FileText, NotebookPen, Layers, MessageSquare, Sparkles, CheckCircle } from 'lucide-react';

export default function ProductPreview() {
  return (
   <div
className="relative w-full max-w-[720px] min-h-[420px] md:min-h-[520px] rounded-2xl shadow-2xl overflow-hidden border border-border"
  style={{ background: '#0F172A' }}
>
      {/* Window Controls */}
      <div className="flex items-center space-x-2 px-4 py-3 border-b border-border" style={{ background: '#111827' }}>
        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
      </div>
      
     <div className="flex flex-col sm:flex-row min-h-[470px]">
        {/* Sidebar */}
        <div className="hidden md:block w-1/4 border-r border-border p-4 space-y-2">
          <div className="flex items-center space-x-2 text-secondary mb-4">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium truncate">Quantum Mechanics.pdf</span>
          </div>
          <div className="flex items-center space-x-2 p-2 rounded-lg" style={{ background: 'rgba(91, 124, 255, 0.1)' }}>
            <NotebookPen className="h-4 w-4 text-accent" />
            <span className="text-xs text-white">Notes</span>
          </div>
          <div className="flex items-center space-x-2 text-secondary p-2 rounded-lg hover:bg-elevated">
            <Layers className="h-4 w-4" />
            <span className="text-xs">Flashcards</span>
          </div>
          <div className="flex items-center space-x-2 text-secondary p-2 rounded-lg hover:bg-elevated">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">Tutor</span>
          </div>
        </div>

        {/* Main Content */}
     <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
               <span className="text-sm font-medium text-white">Quantum Mechanics</span>
               <span className="text-xs px-2 py-0.5 rounded-full flex items-center space-x-1" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                 <CheckCircle className="h-3 w-3" /> Processed
               </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-secondary border border-border rounded-full px-2 py-1">
               <Sparkles className="h-3 w-3 text-accent" />
               <span>AI Generated</span>
            </div>
          </div>

          <div className="flex space-x-4 border-b border-border mb-6">
            <span className="text-xs text-white pb-2 border-b-2 border-accent">Summary</span>
            <span className="text-xs text-secondary pb-2">Key Concepts</span>
            <span className="text-xs text-secondary pb-2">Formulas</span>
          </div>

         <div className="mb-8">
  <p className="text-sm text-secondary leading-7">
    Quantum mechanics studies the behavior of matter and energy
    at atomic and subatomic scales. It introduces concepts such
    as wave-particle duality, uncertainty principle and quantum states.
  </p>
</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 min-h-[140px] rounded-lg border border-border" style={{ background: '#111827' }}>
  <NotebookPen className="h-4 w-4 mb-3 text-accent" />

  <h4 className="text-white font-medium mb-2">
    AI Notes
  </h4>

  <p className="text-xs text-secondary">
    Structured summaries, formulas and key concepts generated automatically.
  </p>
</div>
           <div className="p-6 min-h-[140px] rounded-lg border border-border" style={{ background: '#111827' }}>
  <Layers className="h-4 w-4 mb-3 text-accent" />

  <h4 className="text-white font-medium mb-2">
    Flashcards
  </h4>

  <p className="text-xs text-secondary">
    Active recall cards designed to improve long-term memory retention.
  </p>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
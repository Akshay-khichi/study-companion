import { Sparkles, Send, CheckCircle } from 'lucide-react';

export default function TutorPreview() {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col h-[500px]">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">AI Tutor</span>
        </div>
        <span className="text-xs text-success flex items-center space-x-1">
          <CheckCircle className="h-3 w-3" /> Context loaded
        </span>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-end">
          <div className="bg-accent text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
            Can you explain the Heisenberg Uncertainty Principle simply?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="bg-elevated border border-border p-3 rounded-2xl rounded-tl-sm max-w-[80%] text-sm text-secondary">
            Based on your PDF, it means you can't know exactly where a particle is and how fast it's moving at the same time. The better you know its position, the less you know its momentum, and vice versa.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-accent text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm">
            Give me a practice question.
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2 bg-elevated border border-border rounded-xl p-2">
          <input type="text" placeholder="Ask anything about your document..." className="flex-1 bg-transparent text-sm px-2 focus:outline-none text-primary placeholder:text-secondary" />
          <button className="p-2 bg-accent rounded-lg text-white">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
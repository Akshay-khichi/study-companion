import { NotebookPen } from 'lucide-react';

export default function NotesPreview() {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <NotebookPen className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">AI Notes</span>
        </div>
        <div className="flex space-x-2 text-xs">
          <span className="bg-elevated border border-border px-2 py-1 rounded-md text-primary">Summary</span>
          <span className="text-secondary px-2 py-1">Concepts</span>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-primary mb-2">Key Concepts</h4>
          <ul className="space-y-3 text-sm text-secondary">
            <li className="flex items-start"><span className="text-accent mr-2">•</span>Wave-particle duality</li>
            <li className="flex items-start"><span className="text-accent mr-2">•</span>Superposition</li>
            <li className="flex items-start"><span className="text-accent mr-2">•</span>Heisenberg Uncertainty Principle</li>
          </ul>
        </div>
        <div className="bg-elevated p-4 rounded-lg border border-border">
          <h4 className="text-sm font-semibold text-primary mb-2">Formulas</h4>
          <div className="font-mono text-accent text-sm">Δx Δp ≥ ℏ / 2</div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-elevated rounded-full"></div>
          <div className="h-2 w-5/6 bg-elevated rounded-full"></div>
          <div className="h-2 w-4/6 bg-elevated rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
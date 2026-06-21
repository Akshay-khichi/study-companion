import { CheckCircle, HelpCircle } from 'lucide-react';

export default function QuizPreview() {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Quiz Question 1</span>
        </div>
        <span className="text-xs text-secondary">Score: 0/1</span>
      </div>

      <h3 className="text-lg text-primary mb-6">Which principle states you cannot simultaneously know the exact position and momentum of a particle?</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-elevated text-secondary text-sm">
          <span>Schrödinger's Cat</span>
        </div>
        <div className="flex items-center justify-between p-3 border border-green-500/30 bg-green-500/10 rounded-lg text-white text-sm">
          <span>Heisenberg Uncertainty Principle</span>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
        <div className="flex items-center justify-between p-3 border border-border rounded-lg text-secondary text-sm">
          <span>Pauli Exclusion Principle</span>
        </div>
        <div className="flex items-center justify-between p-3 border border-border rounded-lg text-secondary text-sm">
          <span>Planck's Constant</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-elevated rounded-lg border border-border">
        <p className="text-xs text-secondary"><span className="text-green-500 font-medium">Correct. </span>This principle is fundamental to quantum mechanics.</p>
      </div>
    </div>
  );
}
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 px-8 bg-surface border border-dashed border-border rounded-2xl text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-8">
        <Icon className="h-10 w-10 text-accent" />
      </div>

      <h3 className="text-2xl font-semibold text-primary mb-3">
        {title}
      </h3>

      <p className="text-secondary max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8 text-sm max-w-md w-full">
        <div className="bg-elevated rounded-xl p-3 border border-border">
          📝 AI Notes
        </div>

        <div className="bg-elevated rounded-xl p-3 border border-border">
          🧠 Flashcards
        </div>

        <div className="bg-elevated rounded-xl p-3 border border-border">
          ❓ Quizzes
        </div>

        <div className="bg-elevated rounded-xl p-3 border border-border">
          🤖 AI Tutor
        </div>
      </div>

      {action}
    </motion.div>
  );
}
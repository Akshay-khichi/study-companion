import { Link } from 'react-router-dom';
import { FileText, BookOpen, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DocumentCard({ doc, onDelete }) {
  const statusColors = {
    ready: 'bg-success/10 text-success',
    processing: 'bg-yellow-500/10 text-yellow-500',
    failed: 'bg-red-500/10 text-red-500',
  };

 if (doc.status === 'processing') {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 h-full">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="h-5 w-5 animate-spin text-accent" />

        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
          processing
        </span>
      </div>

      <h3 className="text-white font-medium mb-2 truncate">
        {doc.title}
      </h3>

      <p className="text-secondary text-sm mb-4">
        Generating notes, flashcards and quiz...
      </p>

      <div className="space-y-2">
        <div className="h-2 bg-white/10 rounded animate-pulse"></div>
        <div className="h-2 bg-white/10 rounded w-4/5 animate-pulse"></div>
      </div>
    </div>
  );
}

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ y: -4 }}
      className="bg-elevated border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {doc.type === 'pdf' ? (
            <FileText className="h-6 w-6 text-accent" />
          ) : (
            <BookOpen className="h-6 w-6 text-accent" />
          )}
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[doc.status]}`}
          >
            {doc.status === 'processing' && <Loader2 className="inline h-3 w-3 mr-1 animate-spin" />}
            {doc.status}
          </motion.span>
        </div>
       <button
  onClick={() => {
    if (window.confirm('Delete this material permanently?')) {
      onDelete(doc._id);
    }
  }}
  className="text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <Link to={`/documents/${doc._id}`}>
        <h3 className="font-medium text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {doc.title}
        </h3>
        <p className="text-sm text-secondary">
          {new Date(doc.createdAt).toLocaleDateString()}
        </p>
      </Link>
    </motion.div>
  );
}
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Upload, Type, Loader2, FileText, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { uploadPDF, createTopic, getDocuments, deleteDocument } from '../api/index.js';
import DocumentCard from '../components/DocumentCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CardSkeleton } from '../components/Skeleton.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [topicName, setTopicName] = useState('');
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery({
  queryKey: ['documents'],
  queryFn: async () => (await getDocuments()).data,
  refetchInterval: 5000,
});

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('pdf', file);
      return uploadPDF(formData);
    },
   onSuccess: () => {
 toast.success('Upload Successful', {
  description:
    'Generating Notes, Flashcards, Quiz and AI Tutor. This usually takes 30-60 seconds.',
  duration: 8000,
});

  queryClient.invalidateQueries({ queryKey: ['documents'] });
},
  });

  const topicMutation = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
  toast.success('Topic Received', {
  description:
    'Creating your complete study workspace. Please wait while AI processes the content.',
  duration: 8000,
});
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setTopicName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Material deleted.');
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const recentDoc = documents && documents.length > 0 ? documents[0] : null;

  return (
    <div className="space-y-20">
      <div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Study Workspace
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-secondary">
          Upload a PDF or enter a topic to generate your learning materials.
        </motion.p>
      </div>

      {/* Continue Learning Hero - Motivational Anchor */}
      {recentDoc && recentDoc.status === 'ready' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to={`/documents/${recentDoc._id}`} className="group block relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-surface to-elevated p-8 hover:border-accent/40 transition-colors">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-accent/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-accent uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> Continue Learning
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{recentDoc.title}</h2>
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Updated {new Date(recentDoc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-accent font-medium">
                <span>Resume Session</span>
                <div className="bg-accent/10 p-2 rounded-full border border-accent/20 group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-2xl p-8 hover:border-accent/30 transition-colors group"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-elevated p-2 rounded-lg border border-border group-hover:bg-accent/10 transition-colors">
              <Upload className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold">Upload PDF</h2>
          </div>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploadMutation.isPending ? (
                <Loader2 className="h-8 w-8 text-accent animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-secondary mb-3" />
                  <p className="text-sm text-secondary"><span className="font-medium text-accent">Click to upload</span> or drag and drop</p>
                 <p className="text-xs text-secondary mt-1">PDF up to 10MB</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept="application/pdf" onChange={(e) => e.target.files[0] && uploadMutation.mutate(e.target.files[0])} disabled={uploadMutation.isPending} />
          </label>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-surface border border-border rounded-2xl p-8 hover:border-accent/30 transition-colors group"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-elevated p-2 rounded-lg border border-border group-hover:bg-accent/10 transition-colors">
              <Type className="h-5 w-5 text-accent" />
            </div>
            <h2 className="text-xl font-semibold">Enter Topic</h2>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); topicName.trim() && topicMutation.mutate(topicName); }} className="space-y-4">
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g., Operating Systems, Machine Learning..."
             className="w-full bg-elevated border border-border rounded-xl px-4 py-3 text-primary placeholder:text-secondary focus:outline-none focus:border-accent transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={topicMutation.isPending || !topicName.trim()}
              className="w-full bg-accent text-white py-3 rounded-xl font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {topicMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Generate Materials'}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Materials</h2>
        </div>
        
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton /><CardSkeleton /><CardSkeleton />
          </div>
        ) : documents && documents.length > 0 ? (
          <AnimatePresence>
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc._id} doc={doc} onDelete={(id) => deleteMutation.mutate(id)} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
      <EmptyState
  icon={FileText}
  title="No study materials yet"
  description="Upload a PDF or enter a topic to instantly generate notes, flashcards, quizzes and an AI tutor."
/>
        )}
      </div>
    </div>
  );
}
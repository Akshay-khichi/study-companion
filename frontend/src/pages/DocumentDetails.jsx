import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Loader2, Clock, BookOpen, Layers, HelpCircle, 
  MessageSquare, Sparkles, AlertTriangle, CheckCircle, ArrowRight, Target
} from 'lucide-react';
import { getDocumentById, getProgress } from '../api/index.js';
import { motion } from 'framer-motion';

export default function DocumentDetails() {
  const { id } = useParams();

  const { data: doc, isLoading: docLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => (await getDocumentById(id)).data,
    refetchInterval: (query) =>
  query.state.data?.status === 'processing' ? 3000 : false,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['progress', id],
    queryFn: async () => (await getProgress(id)).data,
    enabled: !!doc && doc.status === 'ready',
  });

  if (docLoading || progressLoading) return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5 }
  };

  // --- REAL CALCULATION LOGIC ---
  
  const calculateMastery = (p) => {
    if (!p) return 0;
    let score = 0;
    if (p.notesViewed) score += 25;
    if (p.flashcardsCompleted) score += 25;
    if (p.quizCompleted) {
      score += 10 + (p.bestQuizScore / 100) * 20; // Max 30% for quiz
    }
    if (p.tutorUsed) score += 10;
    return Math.min(100, Math.round(score));
  };

  const mastery = calculateMastery(progress);

  const generateWeakAreas = (p) => {
    if (!p) return [];
    const areas = [];
    
    if (p.quizAttempts > 0 && p.bestQuizScore < 80) {
      areas.push({
        type: 'Quiz',
        title: 'Overall Quiz Performance',
        detail: `Your best score is ${p.bestQuizScore}%. Review the material and try again.`,
        action: 'Retake Quiz',
        link: 'quiz'
      });
    }
    
    if (p.flashcardsMarkedHard > 0) {
      areas.push({
        type: 'Flashcards',
        title: `${p.flashcardsMarkedHard} Difficult Cards`,
        detail: 'You marked these as "Hard". Focus on memorizing them.',
        action: 'Review Hard Cards',
        link: 'flashcards'
      });
    }

    if (!p.notesViewed) {
      areas.push({
        type: 'Notes',
        title: 'Notes Not Reviewed',
        detail: 'You haven\'t opened the notes for this document yet.',
        action: 'Read Notes',
        link: 'notes'
      });
    }

    return areas.slice(0, 3); // Limit to 3 areas
  };

  const weakAreas = generateWeakAreas(progress);

  const getRecommendedAction = (p) => {
    if (!p) return { text: 'Start Learning', link: 'notes', icon: BookOpen, reason: 'Begin by reading the AI-generated notes.' };
    
    if (!p.notesViewed) return { text: 'Continue Reading Notes', link: 'notes', icon: BookOpen, reason: 'Start with the core concepts to build a foundation.' };
    if (!p.flashcardsCompleted) return { text: 'Review Flashcards', link: 'flashcards', icon: Layers, reason: 'Active recall is needed to solidify your memory.' };
    if (!p.quizCompleted || p.bestQuizScore < 80) return { text: 'Practice Quiz', link: 'quiz', icon: HelpCircle, reason: 'Test your retention to identify blind spots and improve mastery.' };
    if (!p.tutorUsed) return { text: 'Ask AI Tutor', link: 'tutor', icon: MessageSquare, reason: 'Deepen your understanding with contextual conversation.' };
    
    return { text: 'Review Weak Concepts', link: 'notes', icon: AlertTriangle, reason: 'You\'ve completed everything! Review your weak areas to reach 100% mastery.' };
  };

  const recommendation = getRecommendedAction(progress);
  const RecIcon = recommendation.icon;

  const generateTimeline = (p) => {
    if (!p) return [];
    return [
      { status: 'complete', label: 'Document Generated', icon: Sparkles },
      { status: p?.notesViewed ? 'complete' : 'current', label: 'Read AI Notes', icon: BookOpen },
      { status: p?.flashcardsCompleted ? 'complete' : (!p?.notesViewed ? 'pending' : 'current'), label: 'Reviewed Flashcards', icon: Layers },
      { status: p?.quizCompleted ? 'complete' : (!p?.flashcardsCompleted ? 'pending' : 'current'), label: 'Practice Quiz', icon: HelpCircle },
      { status: p?.tutorUsed ? 'complete' : (!p?.quizCompleted ? 'pending' : 'current'), label: 'Ask AI Tutor', icon: MessageSquare },
    ];
  };

const timeline = generateTimeline(progress);

const stepLinks = [
  `/documents/${id}`,
  `/documents/${id}/notes`,
  `/documents/${id}/flashcards`,
  `/documents/${id}/quiz`,
  `/documents/${id}/tutor`,
];

  

  return (
    <div className="max-w-5xl mx-auto space-y-32 py-12">
      
      <motion.div {...fadeUp} className="flex justify-between items-start border-b border-border pb-12">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-secondary hover:text-primary transition-colors text-sm mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Workspace
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3">{doc.title}</h1>
          <div className="flex items-center gap-4 text-sm text-secondary">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Last studied {progress?.lastStudiedAt ? new Date(progress.lastStudiedAt).toLocaleString() : 'never'}</span>
            <span className="text-secondary">•</span>
         {progress && (
  <>
    <span className="text-secondary">•</span>

    <span className="flex items-center gap-1.5">
      <Target className="h-3.5 w-3.5" />
      {mastery}% Mastery
    </span>
        </>
       )}
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-secondary uppercase tracking-wider mb-1">Current Mastery</div>
          <div className="text-4xl font-bold text-accent tracking-tightest flex items-center gap-2 justify-end">
            {mastery}%
            {mastery > 0 && <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(91,124,255,0.8)] animate-pulse"></div>}
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="pt-8">
        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold tracking-tight mb-2">Your Learning Journey</h3>
          <p className="text-secondary">You are {mastery}% through the mastery path. Keep going.</p>
        </div>
        
        <div className="relative flex justify-between items-start w-full px-4">
          <div className="absolute top-6 left-0 h-1 bg-border w-full rounded-full"></div>
          
          {/* Calculate progress width based on timeline */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(timeline.filter(t => t.status === 'complete').length / timeline.length) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-accent/50 to-accent w-full rounded-full shadow-[0_0_15px_rgba(91,124,255,0.5)]"
          ></motion.div>
          
        {timeline.map((item, i) => {
  const clickable =
    item.status === "complete" ||
    item.status === "current";

  const content = (
    <div
      className={`relative z-10 flex flex-col items-center text-center w-1/5 px-2 ${
        clickable
          ? "cursor-pointer hover:scale-105 transition-transform"
          : "cursor-not-allowed opacity-40"
      }`}
    >
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-4 ${
          item.status === 'complete'
            ? 'bg-accent border-accent text-white'
            : item.status === 'current'
            ? 'bg-surface border-accent text-accent'
            : 'bg-surface border-border text-secondary'
        }`}
      >
        {item.status === 'complete'
          ? <CheckCircle className="h-6 w-6" />
          : <item.icon className="h-6 w-6" />}
      </motion.div>

      <span>{item.label}</span>
    </div>
  );

  return clickable ? (
    <Link key={i} to={stepLinks[i]}>
      {content}
    </Link>
  ) : (
    <div key={i}>
      {content}
    </div>
  );
})}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-16 items-start">
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="lg:col-span-3">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-accent uppercase tracking-wider mb-4">
            <Target className="h-3.5 w-3.5" /> Recommended Next Step
          </div>
          <Link to={`/documents/${id}/${recommendation.link}`} className="group block relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-surface to-elevated p-10 hover:border-accent/60 transition-all hover:shadow-[0_0_40px_rgba(91,124,255,0.1)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-accent/10 transition-colors"></div>
            <div className="relative z-10 flex flex-col items-start gap-6">
              <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20 text-accent group-hover:scale-110 transition-transform">
                <RecIcon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{recommendation.text}</h2>
                <p className="text-secondary max-w-md text-lg">
                  {recommendation.reason}
                </p>
              </div>
              <div className="flex items-center gap-2 text-accent font-medium text-lg pt-4">
                <span>Start now</span>
                <div className="bg-accent/10 p-2 rounded-full border border-accent/20 group-hover:translate-x-2 transition-transform">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="lg:col-span-2 space-y-4 lg:pt-12">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold tracking-tight">Focus Areas</h3>
          </div>
          
          {weakAreas.length === 0 ? (
            <div className="border-l-2 border-success/50 pl-5 py-2">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <h4 className="font-medium text-primary">All Caught Up!</h4>
              </div>
              <p className="text-sm text-secondary">No weak areas detected. You are ready for mastery.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-secondary mb-6">Improve these to increase your mastery.</p>
              {weakAreas.map((area, i) => (
                <Link key={i} to={`/documents/${id}/${area.link}`} className="block border-l-2 border-yellow-500/50 pl-5 py-2 group hover:border-yellow-500 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-primary group-hover:text-accent transition-colors">{area.title}</h4>
                    <span className="text-[10px] uppercase tracking-wider text-secondary bg-elevated px-1.5 py-0.5 rounded">{area.type}</span>
                  </div>
                  <p className="text-sm text-secondary mb-2">{area.detail}</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-accent">
                    <span>{area.action}</span> <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </>
          )}
        </motion.div>
      </div>

      <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-8 border-t border-border pt-12">
        <Link to={`/documents/${id}/notes`} className="text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm font-medium">
          <BookOpen className="h-4 w-4" /> Notes
        </Link>
        <Link to={`/documents/${id}/flashcards`} className="text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm font-medium">
          <Layers className="h-4 w-4" /> Flashcards
        </Link>
        <Link to={`/documents/${id}/quiz`} className="text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm font-medium">
          <HelpCircle className="h-4 w-4" /> Quiz
        </Link>
        <Link to={`/documents/${id}/tutor`} className="text-secondary hover:text-accent transition-colors flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4" /> Tutor
        </Link>
      </motion.div>

    </div>
  );
}
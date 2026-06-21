import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, RefreshCw, Layers, HelpCircle, MessageSquare, 
  Sparkles, BookOpen, ChevronDown, AlertTriangle, GraduationCap, 
  Eye, ArrowRight, CheckCircle, ListChecks
} from 'lucide-react';
import { getNotes, regenerateNotes, updateProgress } from '../api/index.js';
import { toast } from 'sonner';



export default function NotesPage() {
  const { id } = useParams();
  const notesViewedRef = useRef(false);
  const queryClient = useQueryClient();
  const [expandedConcept, setExpandedConcept] = useState(null);

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', id],
    queryFn: async () => (await getNotes(id)).data,
  });

  const regenerateMutation = useMutation({
    mutationFn: () => regenerateNotes(id),
    onSuccess: () => {
      toast.success('Notes regenerated successfully');
      queryClient.invalidateQueries({ queryKey: ['notes', id] });
    },
    onError: () => toast.error('Failed to regenerate notes'),
  });

 useEffect(() => {
  if (notes && !notesViewedRef.current) {
    notesViewedRef.current = true;
    updateProgress(id, { notesViewed: true }).catch(console.error);
  }
}, [notes, id]);

  if (isLoading) return <NotesSkeleton />;

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const imageAnim = {
    initial: { opacity: 0, scale: 0.95, y: 30 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="overflow-hidden relative">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        
        {/* SECTION 1: DOCUMENT OVERVIEW */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-40 grid lg:grid-cols-2 gap-24 items-center min-h-[90vh]">
          <motion.div {...fadeUp} className="space-y-8">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1.5 text-xs px-3 py-1 rounded-full bg-success/10 text-success font-medium border border-success/20">
                <CheckCircle className="h-3 w-3" /> Ready
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tightest leading-[0.95]">
              AI Notes
            </h1>
            
            <p className="text-lg text-secondary leading-relaxed max-w-xl">
              {notes?.summary || "Summary not available."}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <motion.button 
                whileHover={{ y: -2 }} 
                whileTap={{ scale: 0.98 }} 
                onClick={() => regenerateMutation.mutate()} 
                disabled={regenerateMutation.isPending} 
                className="flex items-center gap-2 bg-surface/50 backdrop-blur-md border border-white/5 px-5 py-3 rounded-xl text-sm text-secondary hover:text-primary transition-colors"
              >
                {regenerateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span>Regenerate Notes</span>
              </motion.button>
              <Link to={`/documents/${id}/tutor`} className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-xl text-sm hover:bg-accent/90 transition-colors shadow-[0_4px_20px_rgba(91,124,255,0.3)]">
                <MessageSquare className="h-4 w-4" /> Ask AI Tutor
              </Link>
            </div>
          </motion.div>

          <motion.div {...imageAnim} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent blur-2xl rounded-full"></div>
            
            <div className="relative bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Key Concepts</h4>
                  <div className="space-y-2">
                    {notes?.keyConcepts?.map((concept, i) => (
                      <div key={i} className="text-primary flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-accent mt-1" /> {concept}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                    <div className="text-xs text-secondary mb-1">Important Points</div>
                    <div className="text-primary font-medium flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-accent" /> {notes?.importantPoints?.length || 0} Points
                    </div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                    <div className="text-xs text-secondary mb-1">Common Mistakes</div>
                    <div className="text-primary font-medium flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-accent" /> {notes?.commonMistakes?.length || 0} Mistakes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: CONCEPT EXPLORER */}
        <section className="max-w-7xl mx-auto px-6 py-40 grid lg:grid-cols-2 gap-24 items-center border-t border-white/5">
          <motion.div {...fadeUp} className="lg:pr-10">
            <div className="inline-flex items-center space-x-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-6">
              <BookOpen className="h-3 w-3" /> CONCEPT EXPLORER
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Understand the architecture, not just the definition.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              Review the structured sections derived directly from your document.
            </p>
          </motion.div>

          <motion.div {...imageAnim} className="space-y-4">
            {notes?.structuredSections?.map((section, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -2 }}
                className="bg-surface/70 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden transition-all hover:border-accent/30"
              >
                <div 
                  className="p-6 cursor-pointer flex items-center justify-between gap-4"
                  onClick={() => setExpandedConcept(expandedConcept === i ? null : i)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-primary">{section.heading}</h3>
                    </div>
                    <p className="text-sm text-secondary line-clamp-2">{section.content}</p>
                  </div>
                  <motion.div animate={{ rotate: expandedConcept === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="h-5 w-5 text-secondary" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expandedConcept === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/5 bg-white/[0.02]"
                    >
                      <div className="p-6 space-y-4">
                        <p className="text-sm text-secondary leading-relaxed">{section.content}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* SECTION 3: AI INSIGHTS */}
        <section className="max-w-7xl mx-auto px-6 py-40 grid lg:grid-cols-2 gap-24 items-center border-t border-white/5">
          <motion.div {...imageAnim} className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent blur-2xl"></div>
            <div className="relative bg-surface/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl">
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div className="bg-accent/10 p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">AI Mentor Insights</h3>
              </div>
              
              <div className="space-y-8">
                <InsightItem 
                  icon={AlertTriangle} 
                  color="red" 
                  title="Common Mistakes" 
                  content={notes?.commonMistakes?.[0] || "No common mistakes identified."} 
                />
                <div className="h-px bg-white/5"></div>
                <InsightItem 
                  icon={GraduationCap} 
                  color="blue" 
                  title="Important Points" 
                  content={notes?.importantPoints?.[0] || "No specific important points highlighted."} 
                />
                <div className="h-px bg-white/5"></div>
                <InsightItem 
                  icon={HelpCircle} 
                  color="yellow" 
                  title="Revision Notes" 
                  content={notes?.revisionNotes?.[0] || "No revision notes available."} 
                />
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="order-1 lg:order-2 lg:pl-10">
            <div className="inline-flex items-center space-x-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-6">
              <Sparkles className="h-3 w-3" /> AI INSIGHTS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              An AI mentor that knows where you’ll stumble.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              We don't just give you notes. We analyze the material to predict common mistakes, identify exam-critical topics, and highlight concepts students usually misunderstand.
            </p>
          </motion.div>
        </section>

        {/* SECTION 4: REVISION WORKSPACE */}
        <section className="max-w-7xl mx-auto px-6 py-40 grid lg:grid-cols-2 gap-24 items-center border-t border-white/5">
          <motion.div {...fadeUp} className="lg:pr-10">
            <div className="inline-flex items-center space-x-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-6">
              <Eye className="h-3 w-3" /> REVISION MODE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Built for the night before the exam.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              Access quick review points and revision notes. Cut through the noise and focus only on what matters.
            </p>
          </motion.div>

          <motion.div {...imageAnim} className="relative">
            <div className="absolute inset-0 bg-gradient-to-tl from-accent/10 to-transparent blur-2xl rounded-2xl"></div>
            <div className="relative bg-surface/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Revision Notes</h4>
                <ul className="space-y-3">
                  {notes?.revisionNotes?.map((note, i) => (
                    <li key={i} className="text-lg text-primary leading-relaxed font-medium flex items-start gap-2">
                      <ArrowRight className="h-5 w-5 text-accent mt-1" /> {note}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">Important Points</h4>
                  <ul className="space-y-3">
                    {notes?.importantPoints?.map((point, i) => (
                      <li key={i} className="text-sm text-secondary flex items-start">
                        <ArrowRight className="h-4 w-4 text-accent mr-2 mt-0.5" /> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 5: INTERVIEW PREP */}
        <section className="max-w-7xl mx-auto px-6 py-40 grid lg:grid-cols-2 gap-24 items-center border-t border-white/5">
          <motion.div {...imageAnim} className="order-2 lg:order-1 space-y-4">
            {notes?.interviewQuestions?.map((q, i) => (
              <InterviewCard key={i} q={q} delay={i * 0.1} />
            ))}
          </motion.div>

          <motion.div {...fadeUp} className="order-1 lg:order-2 lg:pl-10">
            <div className="inline-flex items-center space-x-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-6">
              <MessageSquare className="h-3 w-3" /> INTERVIEW PREP
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Ace the viva.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              Practice with auto-generated interview questions tailored to your document. Reveal answers when ready, track difficulty levels, and walk into your interview with confidence.
            </p>
          </motion.div>
        </section>

        {/* SECTION 6: LEARNING PATH */}
        <section className="max-w-7xl mx-auto px-6 py-40 grid lg:grid-cols-2 gap-24 items-center border-t border-white/5">
          <motion.div {...fadeUp} className="lg:pr-10">
            <div className="inline-flex items-center space-x-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full mb-6">
              <CheckCircle className="h-3 w-3" /> NEXT ACTIONS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Never wonder what to do next.
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              Your learning path is clear. Move to active recall with flashcards, test your knowledge with a quiz, or dive deeper with the AI tutor.
            </p>
          </motion.div>

          <motion.div {...imageAnim} className="space-y-4">
            <NextActionCard 
              icon={Layers} 
              title="Continue to Flashcards" 
              desc="Memorize the concepts extracted from your document." 
              link={`/documents/${id}/flashcards`} 
            />
            <NextActionCard 
              icon={HelpCircle} 
              title="Take the Quiz" 
              desc="Test your knowledge with auto-generated questions." 
              link={`/documents/${id}/quiz`} 
            />
            <NextActionCard 
              icon={MessageSquare} 
              title="Ask AI Tutor" 
              desc="Dive deeper into any concept with contextual chat." 
              link={`/documents/${id}/tutor`} 
            />
          </motion.div>
        </section>

      </div>
    </div>
  );
}

// --- Helper Components ---

const InsightItem = ({ icon: Icon, color, title, content }) => {
  const colorClasses = {
    red: 'text-red-500 bg-red-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-green-500 bg-green-500/10',
  };
  return (
    <div className="flex gap-4">
      <div className={`p-2.5 rounded-lg h-fit ${colorClasses[color]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-primary mb-1">{title}</h4>
        <p className="text-sm text-secondary leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

const InterviewCard = ({ q, delay }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2 }}
      className="bg-surface/70 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors"
    >
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-lg font-medium text-primary">{q}</h3>
        <span className="text-[10px] px-2 py-1 rounded-full font-medium uppercase tracking-wider flex-shrink-0 bg-accent/10 text-accent">Question</span>
      </div>
      <AnimatePresence>
        {revealed ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <p className="text-sm text-secondary pt-2 border-t border-white/5">Review your document for the detailed answer.</p>
            <button onClick={() => setRevealed(false)} className="text-xs text-accent mt-4 hover:underline">Hide</button>
          </motion.div>
        ) : (
          <button onClick={() => setRevealed(true)} className="text-sm text-accent border border-accent/30 px-4 py-1.5 rounded-lg hover:bg-accent/10 transition-colors">
            Reveal Hint
          </button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const NextActionCard = ({ icon: Icon, title, desc, link }) => (
  <Link to={link} className="group block bg-surface/70 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-accent/30 transition-all relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-accent/10 transition-colors"></div>
    <div className="relative z-10 flex items-center gap-6">
      <div className="bg-white/5 p-4 rounded-lg border border-white/5 group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-sm text-secondary">{desc}</p>
      </div>
      <ArrowRight className="h-6 w-6 text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
    </div>
  </Link>
);

const NotesSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-32 min-h-[90vh] grid lg:grid-cols-2 gap-16 items-center animate-pulse">
    <div className="space-y-6">
      <div className="h-6 bg-elevated rounded w-40"></div>
      <div className="h-16 bg-elevated rounded w-3/4"></div>
      <div className="h-4 bg-elevated rounded w-full"></div>
      <div className="h-4 bg-elevated rounded w-5/6"></div>
      <div className="h-12 bg-elevated rounded w-1/2 mt-8"></div>
    </div>
    <div className="h-96 bg-elevated rounded-2xl"></div>
  </div>
);
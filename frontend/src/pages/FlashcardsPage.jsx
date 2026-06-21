import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCw, RotateCcw, Check, X } from 'lucide-react';
import { getFlashcards, regenerateFlashcards, updateProgress } from '../api/index.js';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardsPage() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
 
  const queryClient = useQueryClient();

  const { data: flashcards, isLoading } = useQuery({
    queryKey: ['flashcards', id],
    queryFn: async () => (await getFlashcards(id)).data,
  });

const regenerateMutation = useMutation({
  mutationFn: () => regenerateFlashcards(id),
  onSuccess: () => {
    toast.success('Flashcards regenerated');
    queryClient.invalidateQueries({ queryKey: ['flashcards', id] });

    setCurrentIndex(0);
    setIsFlipped(false);
    setDirection(0);
    setSessionComplete(false);
  },
});

   const cards = flashcards?.cards || [];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate('Hard');
        if (e.key === '2') handleRate('Good');
        if (e.key === '3') handleRate('Easy');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFlipped]);

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

 
  if (cards.length === 0) return <div className="text-center text-secondary py-24 text-lg">No flashcards available.</div>;

  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleRate = async (rating) => {
    setDirection(1);
    setIsFlipped(false);
    
    try {
      const updateData = {};
    if (rating === 'Hard') {
  updateData.flashcardsMarkedHard = 1;
}
      
  
      
     if (currentIndex >= cards.length - 1) {
  updateData.flashcardsCompleted = true;
}
      
      if (Object.keys(updateData).length > 0) {
        await updateProgress(id, updateData);
      }
    } catch (err) {
      console.error(err);
    }

setTimeout(() => {
  if (currentIndex < cards.length - 1) {
    setCurrentIndex(prev => prev + 1);
  } else {
    setSessionComplete(true);
  }
}, 200);
  };

const handlePrev = () => {
  setDirection(-1);
  setIsFlipped(false);

  setTimeout(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, 200);
};

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0, rotate: direction > 0 ? 5 : -5 }),
    center: { x: 0, opacity: 1, rotate: 0 },
    exit: (direction) => ({ x: direction > 0 ? -100 : 100, opacity: 0, rotate: direction > 0 ? -5 : 5 }),
  };

if (sessionComplete) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 text-center">

      <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
        <Check className="h-12 w-12 text-green-400" />
      </div>

      <div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Deck Completed
        </h1>

        <p className="text-lg text-secondary">
          You reviewed all flashcards successfully.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl px-10 py-6">
        <p className="text-4xl font-bold text-accent">
          {cards.length}/{cards.length}
        </p>

        <p className="text-secondary mt-2">
          Flashcards Reviewed
        </p>
      </div>

     <div className="flex items-center gap-4">

  <button
    onClick={() => {
      setCurrentIndex(0);
      setIsFlipped(false);
      setDirection(0);
      setSessionComplete(false);
    }}
    className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
  >
    Restart Deck
  </button>

  <Link
    to="/dashboard"
    className="bg-surface border border-border hover:border-accent text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
  >
    Dashboard
  </Link>

</div>

    </div>
  );
}

  return (
    <div className="space-y-12 flex flex-col items-center min-h-[80vh]">
      <div className="w-full flex items-center justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Flashcards</h1>
      <p className="text-secondary mt-2">
  Review each flashcard and rate your confidence.
</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => regenerateMutation.mutate()}
          disabled={regenerateMutation.isPending}
          className="flex items-center space-x-2 bg-surface border border-border px-4 py-2 rounded-lg text-sm hover:border-accent transition-colors text-secondary hover:text-primary"
        >
          {regenerateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span>Shuffle</span>
        </motion.button>
      </div>

      <div className="w-full max-w-2xl flex items-center gap-4">
        <span className="text-sm font-mono text-accent">
{Math.min(currentIndex + 1, cards.length)} / {cards.length}
</span>
        <div className="flex-1 h-1.5 bg-elevated rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="w-full max-w-2xl h-96 [perspective:1000px] flex items-center justify-center">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''} cursor-pointer`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="absolute w-full h-full [backface-visibility:hidden] bg-surface border border-border rounded-2xl p-12 flex flex-col items-center justify-center shadow-xl">
              <span className="text-xs uppercase tracking-wider text-secondary absolute top-6 left-6">Question {currentIndex + 1}</span>
              <span className="text-xs uppercase tracking-wider absolute top-6 right-6 px-2 py-1 border border-border rounded-full bg-elevated text-secondary">{card.difficulty}</span>
              <h3 className="text-3xl font-medium text-center">{card.front}</h3>
 
            </div>
            <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-accent border border-accent rounded-2xl p-12 flex flex-col items-center justify-center shadow-xl">
              <span className="text-xs uppercase tracking-wider text-white/70 absolute top-6 left-6">Answer</span>
              <p className="text-white text-2xl text-center">{card.back}</p>
              {card.hint && <p className="text-white/70 text-sm mt-8 absolute bottom-8">Hint: {card.hint}</p>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

   <div className="flex flex-col items-center gap-4 w-full max-w-2xl">

  <div className="grid grid-cols-3 gap-4 w-full">
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => handleRate('Hard')}
      className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 py-3 rounded-xl font-medium hover:bg-red-500/20 transition-colors"
    >
      <X className="h-4 w-4" />
      Hard
    </motion.button>

    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => handleRate('Good')}
      className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 py-3 rounded-xl font-medium hover:bg-yellow-500/20 transition-colors"
    >
      Good
    </motion.button>

    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => handleRate('Easy')}
      className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-500 py-3 rounded-xl font-medium hover:bg-green-500/20 transition-colors"
    >
      <Check className="h-4 w-4" />
      Easy
    </motion.button>
  </div>

  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={handlePrev}
    className="text-sm text-secondary hover:text-primary transition-colors"
  >
    ← Previous Card
  </motion.button>

</div>

    </div>
  );
}
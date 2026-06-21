import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCw, ArrowRight } from 'lucide-react';
import { getQuiz, regenerateQuiz, updateProgress } from '../api/index.js';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const queryClient = useQueryClient();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => (await getQuiz(id)).data,
  });

  const regenerateMutation = useMutation({
    mutationFn: (count) => regenerateQuiz(id, count),
    onSuccess: () => {
      toast.success('Quiz regenerated');
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
      setCurrentQ(0);
      setSubmitted(false);
      setSelectedAnswers({});
      queryClient.removeQueries({ queryKey: ['quiz', id] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;

  const questions = quiz?.questions || [];
  if (questions.length === 0) return <div className="text-center text-secondary py-24">No quiz questions available.</div>;

  const question = questions[currentQ];
  const score = questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;
  const isLastQuestion = currentQ === questions.length - 1;

  const handleSelect = (option) => {
  setSelectedAnswers(prev => ({
    ...prev,
    [currentQ]: option
  }));
};

  const handleNext = async () => {
    if (isLastQuestion) {
      setSubmitted(true);
 const correctCount = questions.filter(
  (q, i) => selectedAnswers[i] === q.correctAnswer
).length;

const finalScore = Math.round(
  (correctCount / questions.length) * 100
);
      
      try {
        await updateProgress(id, { 
          bestQuizScore: finalScore, 
          quizCompleted: true 
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };


  if (reviewMode) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <button
        onClick={() => setReviewMode(false)}
        className="text-accent hover:text-white"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-8">
        Review Answers
      </h1>

      {questions.map((q, i) => {
        const userAnswer = selectedAnswers[i];
        const correctAnswer = q.correctAnswer;

        return (
          <div
            key={i}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            <h3 className="font-semibold text-lg mb-4">
              Q{i + 1}. {q.question}
            </h3>

            <div className="space-y-2">
              <p className="text-red-400">
                Your Answer: {userAnswer || "Not Answered"}
              </p>

              <p className="text-green-400">
                Correct Answer: {correctAnswer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const percentage = Math.round((score / questions.length) * 100);

const scoreColor =
  percentage >= 90
    ? 'text-green-400'
    : percentage >= 70
    ? 'text-yellow-400'
    : 'text-red-400';


  return (
    <div className="space-y-12 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-8">
       <div>

  <button
    onClick={() => navigate(-1)}
    className="mb-6 flex items-center gap-2 text-accent hover:text-white transition-colors"
  >
    ← Back to Learning Journey
  </button>

  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Knowledge Check</h1>
          <p className="text-secondary mt-2">Test your understanding before moving on.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary hidden sm:block">Length:</span>
          {[10, 20, 30].map(c => (
            <button
              key={c}
              onClick={() => regenerateMutation.mutate(c)}
              disabled={regenerateMutation.isPending}
              className="bg-surface border border-border px-3 py-1.5 rounded-lg text-sm hover:border-accent text-secondary hover:text-primary transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-2xl p-12 text-center shadow-xl"
          >
            <h2 className="text-2xl font-medium mb-4 text-secondary">Assessment Complete</h2>
            <motion.p 
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}
              className={`text-7xl font-bold tracking-tightest mb-4 ${scoreColor}`}
            >
            {percentage}%
            </motion.p>
            <p className="text-secondary mb-8">You answered {score} out of {questions.length} correctly.</p>
            <button 
          onClick={() => {
  setReviewMode(true);
  setSubmitted(false);
  setCurrentQ(0);
}}
              className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Review Answers
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center text-sm text-secondary">
              <span className="font-mono text-accent">Question {currentQ + 1} / {questions.length}</span>
              <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-medium">{question.difficulty}</span>
            </div>

            <div className="h-1 w-full bg-elevated rounded-full overflow-hidden mb-8">
              <motion.div 
                className="h-full bg-accent" 
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="bg-surface border border-border rounded-3xl p-10 shadow-2xl">
           <div className="flex items-center gap-4 mb-8">
  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
    Q{currentQ + 1}
  </div>

  <h3 className="text-3xl font-semibold text-white">
    {question.question}
  </h3>
</div>
              <div className="grid grid-cols-1 gap-4">
                {question.options.map((opt, oIndex) => {
                  const isSelected = selectedAnswers[currentQ] === opt;
                  const isCorrect = question.correctAnswer === opt;
                  
                  let bgClass = "bg-elevated border-border hover:border-accent/50 text-secondary";
                  if (isSelected) bgClass = "bg-accent/15 border-accent shadow-lg shadow-accent/10 text-primary scale-[1.02]";
                if ((submitted || reviewMode) && isCorrect) bgClass = "bg-success/10 border-success text-primary";
              if ((submitted || reviewMode) && isSelected && !isCorrect) bgClass = "bg-red-500/10 border-red-500 text-primary";

                  return (
                    <motion.button
                   whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={oIndex}
                    onClick={() => {
  if (!reviewMode) {
    handleSelect(opt);
  }
}}
                   disabled={false}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg text-left transition-all ${bgClass}`}
                    >
                      <span className="text-sm font-medium">{opt}</span>
                      {selectedAnswers[currentQ] && <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>}
                      </div>}
                    </motion.button>
                  );
                })}
              </div>
            </div>

           <div className="flex justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!selectedAnswers[currentQ]}
                onClick={handleNext}
            className="flex items-center gap-3 bg-accent text-white px-12 py-4 rounded-2xl text-lg font-semibold shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all"
              >
                {isLastQuestion ? 'Finish' : 'Next Question'} <ArrowRight className="h-4 w-4" />
              </motion.button>
              
            </div>
            <p className="text-center text-secondary text-sm mt-4">
  You can change your answer anytime before proceeding.
</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
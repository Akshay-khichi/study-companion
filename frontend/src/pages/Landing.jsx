import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, FileText, NotebookPen, Layers, HelpCircle, MessageSquare, BookOpen, Zap, Target, Clock,Github } from 'lucide-react';
import LandingNavbar from '../components/LandingNavbar.jsx';
import ProductPreview from '../components/previews/ProductPreview.jsx';
import NotesPreview from '../components/previews/NotesPreview.jsx';
import FlashcardPreview from '../components/previews/FlashcardPreview.jsx';
import QuizPreview from '../components/previews/QuizPreview.jsx';
import TutorPreview from '../components/previews/TutorPreview.jsx';

export default function Landing() {
  const navigate = useNavigate();

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5 }
  };

  const features = [
    { icon: NotebookPen, title: 'AI Notes', desc: 'Structured summaries, key concepts, and revision notes generated instantly.', component: NotesPreview },
    { icon: Layers, title: 'Smart Flashcards', desc: 'Active recall cards with difficulty ratings to optimize memory retention.', component: FlashcardPreview },
    { icon: HelpCircle, title: 'Adaptive Quizzes', desc: 'Test your knowledge with auto-generated questions and detailed explanations.', component: QuizPreview },
    { icon: MessageSquare, title: 'Contextual AI Tutor', desc: 'Chat with an AI that knows your document inside out and guides your study.', component: TutorPreview }
  ];

  const benefits = [
    { icon: Zap, title: 'Instant Generation', desc: 'Upload a PDF or enter a topic. Get a full study workspace in seconds, not hours.' },
    { icon: Target, title: 'Track Mastery', desc: 'Visual progress indicators show exactly what you’ve mastered and what needs work.' },
    { icon: Clock, title: 'Exam Ready', desc: 'One-minute revision sheets and interview prep questions ensure you are always ready.' },
    { icon: BookOpen, title: 'Deep Understanding', desc: 'Go beyond memorization. The AI tutor helps you grasp the why, not just the what.' }
  ];

  return (
    <div className="bg-background min-h-screen">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center relative z-10">
          
          {/* Left Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 mb-8"
              style={{ background: 'rgba(91, 124, 255, 0.1)', border: '1px solid rgba(91, 124, 255, 0.2)' }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: '#5B7CFF' }} />
              <span className="text-xs font-medium tracking-wide" style={{ color: '#5B7CFF' }}>AI-POWERED STUDY WORKSPACE</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[0.95] mb-8 text-white"
            >
              Turn course PDFs into a focused study system.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg mb-10 max-w-xl leading-relaxed text-secondary"
            >
              Upload a lecture and instantly generate notes, flashcards, quizzes, and an AI tutor that knows your material.
            </motion.p>

      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="flex flex-col sm:flex-row gap-4"
>
  <motion.button
    onClick={() => navigate('/dashboard')}
    animate={{ y: [0, -4, 0] }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    whileHover={{
      scale: 1.05,
      y: -6,
      boxShadow: "0 15px 40px rgba(91,124,255,0.6)"
    }}
    whileTap={{ scale: 0.97 }}
    className="group flex items-center justify-center space-x-2 text-white px-6 py-3.5 rounded-xl font-medium"
    style={{
      background: '#5B7CFF',
      boxShadow: '0 10px 30px -10px rgba(91,124,255,0.5)'
    }}
  >
    <FileText className="h-4 w-4" />
    <span>Upload a PDF</span>
  </motion.button>

  <motion.button
    onClick={() => navigate('/dashboard')}
    animate={{ y: [0, -4, 0] }}
    transition={{
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.4
    }}
    whileHover={{
      scale: 1.05,
      y: -6,
      borderColor: '#5B7CFF',
      boxShadow: '0 10px 30px rgba(91,124,255,0.25)'
    }}
    whileTap={{ scale: 0.97 }}
    className="flex items-center justify-center space-x-2 border text-white px-6 py-3.5 rounded-xl font-medium"
    style={{
      background: '#0F172A',
      borderColor: 'rgba(255,255,255,0.08)'
    }}
  >
    <span>Open Dashboard</span>
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
  </motion.button>
</motion.div>
          </div>

          {/* Right Side: Interactive Product Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-8"
          >
            <ProductPreview />
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section    id="workflow"   className="py-32 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold tracking-tight mb-16 max-w-3xl text-white">
            Everything stays connected to the document you uploaded.
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '01', title: 'Upload', desc: 'Drag in your PDF lecture notes.', icon: FileText },
              { num: '02', title: 'Organize', desc: 'AI extracts key concepts automatically.', icon: NotebookPen },
              { num: '03', title: 'Review', desc: 'Flip through generated flashcards.', icon: Layers },
              { num: '04', title: 'Test', desc: 'Take quizzes tuned to your material.', icon: Sparkles },
              { num: '05', title: 'Ask', desc: 'Chat with a context-aware tutor.', icon: MessageSquare },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl p-6 border transition-colors group"
                style={{ background: '#0F172A', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                <div className="text-sm font-mono mb-8" style={{ color: '#5B7CFF' }}>{step.num}</div>
                <step.icon className="h-6 w-6 text-white mb-4" />
                <h3 className="text-lg font-medium mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section   id="features" className="py-32 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 mb-6" style={{ background: 'rgba(91, 124, 255, 0.1)', border: '1px solid rgba(91, 124, 255, 0.2)' }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: '#5B7CFF' }} />
              <span className="text-xs font-medium tracking-wide" style={{ color: '#5B7CFF' }}>CORE FEATURES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">See every study tool in action.</h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">Stop juggling apps. Nexora brings your notes, flashcards, quizzes, and tutor into one seamless interface.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, i) => {
              const FeatureComponent = feature.component;
              return (
                <motion.div
                
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col space-y-6"
                >
                  <FeatureComponent />
                  <div className="px-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="inline-block p-2 rounded-lg border" style={{ background: 'rgba(91, 124, 255, 0.1)', borderColor: 'rgba(91, 124, 255, 0.2)' }}>
                        <feature.icon className="h-5 w-5" style={{ color: '#5B7CFF' }} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-secondary leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Built for serious students.</h2>
            <p className="text-lg text-secondary max-w-2xl">Designed to optimize retention, track progress, and get you exam-ready faster.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col space-y-4"
              >
                <div className="w-12 h-12 rounded-xl border flex items-center justify-center" style={{ background: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <benefit.icon className="h-5 w-5" style={{ color: '#5B7CFF' }} />
                </div>
                <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      
      <section className="py-32 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
  <div className="max-w-5xl mx-auto text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative rounded-3xl p-12 md:p-20 overflow-hidden border"
      style={{
        background: '#0F172A',
        borderColor: 'rgba(91, 124, 255, 0.3)'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-40 -mt-40"
          style={{ background: 'rgba(91, 124, 255, 0.1)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl -ml-40 -mb-40"
          style={{ background: 'rgba(91, 124, 255, 0.05)' }}
        />
      </div>

      <div className="relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Start learning smarter today.
        </h2>

        <p className="text-lg text-secondary mb-10 max-w-2xl mx-auto">
          Transform your static PDFs into an interactive study workspace.
          No accounts needed. No setup required.
        </p>

        <motion.button
          whileHover={{
            scale: 1.05,
            y: -3,
            boxShadow: '0 20px 40px rgba(91,124,255,0.4)'
          }}
          whileTap={{ scale: 0.97 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20
          }}
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center space-x-2 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg"
          style={{
            background: '#5B7CFF',
            boxShadow: '0 10px 30px -10px rgba(91, 124, 255, 0.5)'
          }}
        >
          <span>Open Dashboard</span>

          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  </div>
       </section>


      {/* Minimal Footer */}
     <footer
  className="py-12 px-6 border-t"
  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
>
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
    
    <div className="flex items-center space-x-2">
      <span className="font-semibold tracking-tight text-white">
        Study Companion 
      </span>
    </div>

    <div className="text-center">
      <p className="text-sm text-secondary">
        Built by <span className="text-white font-medium">Akshay Khichi</span>
      </p>
    </div>

    <div className="flex items-center gap-6">
     <a
  href="https://github.com/YOUR_GITHUB_USERNAME"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors"
>
  <Github className="h-5 w-5" />
  <span>GitHub</span>
</a>

     
    </div>

    <div className="text-sm text-secondary">
      © {new Date().getFullYear()} 
    </div>
  </div>
</footer>
    </div>
  );
}
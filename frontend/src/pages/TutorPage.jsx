import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Send, FileText, Sparkles, HelpCircle, BookOpen } from 'lucide-react';
import { chatWithTutor, getDocumentById, updateProgress } from '../api/index.js';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function TutorPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: doc } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => (await getDocumentById(id)).data,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim() || isSending) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const res = await chatWithTutor({ documentId: id, message: messageText, sessionId });
      setSessionId(res.data.sessionId);
      setMessages(prev => [...prev, { role: 'model', content: res.data.message }]);
      
      await updateProgress(id, { 
        tutorUsed: true, 
        tutorMessages: 1 
      });
    } catch (error) {
      toast.error('Failed to get response from tutor');
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    { icon: Sparkles, text: "Summarize the main concept" },
    { icon: HelpCircle, text: "Give me a practice question" },
    { icon: BookOpen, text: "Explain this in simpler terms" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-8 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Tutor</h1>
          <p className="text-secondary mt-2">Ask questions with your document already in context.</p>
        </div>
        {doc && (
          <div className="hidden md:flex items-center gap-2 text-sm text-secondary bg-surface px-4 py-2 rounded-full border border-border">
            <FileText className="h-4 w-4 text-accent" />
            <span className="truncate max-w-[150px]">{doc.title}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-surface/50 border border-border rounded-xl p-8 space-y-6 mb-4 min-h-[400px] backdrop-blur-sm">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-medium mb-2">Start your tutoring session</h3>
            <p className="text-secondary text-sm mb-8 max-w-sm">I have read your document. Ask me anything, or try one of these prompts:</p>
            <div className="flex flex-col gap-3 w-full max-w-md">
              {quickPrompts.map((p, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(p.text)}
                  className="flex items-center gap-3 bg-elevated border border-border hover:border-accent/50 rounded-xl p-4 text-left text-sm text-primary transition-colors"
                >
                  <div className="bg-background/50 p-2 rounded-lg border border-border">
                    <p.icon className="h-4 w-4 text-accent" />
                  </div>
                  {p.text}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-accent text-white rounded-tr-sm' : 'bg-elevated border border-border text-primary rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isSending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-elevated border border-border p-4 rounded-2xl rounded-tl-sm flex items-center space-x-2">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your document..."
          className="flex-1 bg-surface border border-border rounded-xl px-6 py-4 focus:outline-none focus:border-accent transition-colors text-lg"
          disabled={isSending}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSending || !input.trim()}
          className="bg-accent text-white p-4 rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-colors"
        >
          {isSending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
        </motion.button>
      </form>
    </div>
  );
}
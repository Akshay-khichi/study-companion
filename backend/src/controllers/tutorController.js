import Document from '../models/Document.js';
import ChatSession from '../models/ChatSession.js';
import ChatMessage from '../models/ChatMessage.js';
import Progress from '../models/Progress.js';
import { chatWithAI } from '../services/aiService.js';

export const chatWithTutor = async (req, res, next) => {
  try {
    const { documentId, message, sessionId } = req.body;

    if (!documentId || !message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Document ID and message are required' });
    }

    const doc = await Document.findById(documentId);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const newSession = new ChatSession({ document: documentId });
      await newSession.save();
      currentSessionId = newSession._id;
    }

    const userMessage = new ChatMessage({
      session: currentSessionId,
      role: 'user',
      content: message,
    });
    await userMessage.save();

    const previousMessages = await ChatMessage.find({ session: currentSessionId })
      .sort({ createdAt: 1 })
      .limit(10);

     const history = previousMessages.map(msg => ({
   role: msg.role === 'model' ? 'assistant' : 'user',
    content: msg.content,
     }));

    const contextPrompt = doc.type === 'pdf' 
      ? `You are an AI Tutor. The user uploaded a document. Use the following document content to answer questions:\n\n${doc.content.substring(0, 5000)}\n\nUser question: ${message}`
      : `You are an AI Tutor teaching about ${doc.title}. Provide detailed explanations, examples, and step-by-step guidance.\n\nUser question: ${message}`;

    const modelResponse = await chatWithAI(history, contextPrompt);

    const aiMessage = new ChatMessage({
      session: currentSessionId,
      role: 'model',
      content: modelResponse,
    });
    await aiMessage.save();

    // Update progress: mark tutor as used and increment message count
    await Progress.findOneAndUpdate(
      { documentId },
      { 
        $set: { tutorUsed: true, tutorUsedAt: new Date(), lastStudiedAt: new Date() },
        $inc: { tutorMessages: 1 } 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      sessionId: currentSessionId,
      message: modelResponse,
    });
  } catch (error) {
    next(error);
  }
};
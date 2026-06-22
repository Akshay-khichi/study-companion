import axios from 'axios';

// Generate anonymous user id once
let userId = localStorage.getItem('userId');

if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem('userId', userId);
}

const api = axios.create({
  baseURL: 'https://study-companion-u519.onrender.com/api',
});

// Send user id with every request
api.defaults.headers.common['x-user-id'] = userId;

export const uploadPDF = (formData) =>
  api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const createTopic = (topicName) =>
  api.post('/documents/topic', { topicName });

export const getDocuments = () =>
  api.get('/documents');

export const getDocumentById = (id) =>
  api.get(`/documents/${id}`);

export const deleteDocument = (id) =>
  api.delete(`/documents/${id}`);

export const getNotes = (id) =>
  api.get(`/notes/${id}`);

export const getFlashcards = (id) =>
  api.get(`/flashcards/${id}`);

export const getQuiz = (id) =>
  api.get(`/quiz/${id}`);

export const chatWithTutor = (data) =>
  api.post('/tutor/chat', data);

export const regenerateNotes = (documentId) =>
  api.post('/regenerate/notes', { documentId });

export const regenerateFlashcards = (documentId) =>
  api.post('/regenerate/flashcards', { documentId });

export const regenerateQuiz = (documentId, count) =>
  api.post('/regenerate/quiz', { documentId, count });

// Progress
export const getProgress = (documentId) =>
  api.get(`/progress/${documentId}`);

export const updateProgress = (documentId, data) =>
  api.put(`/progress/${documentId}`, data);

export default api;
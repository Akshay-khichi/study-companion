import Quiz from '../models/Quiz.js';

export const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ document: req.params.id });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found or still processing' });
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};
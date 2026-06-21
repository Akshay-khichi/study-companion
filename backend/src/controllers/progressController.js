import Progress from '../models/Progress.js';

export const getProgress = async (req, res, next) => {
  try {
    let progress = await Progress.findOne({ documentId: req.params.documentId });
    
    // If no progress record exists, create a default one
    if (!progress) {
      progress = await Progress.create({ documentId: req.params.documentId });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const updateData = { ...req.body, lastStudiedAt: Date.now() };
    const incData = { 
      tutorMessages: req.body.tutorMessages || 0,
      flashcardsMarkedHard: req.body.flashcardsMarkedHard || 0
    };

    // Remove increment fields from $set
    delete updateData.tutorMessages;
    delete updateData.flashcardsMarkedHard;

    // Handle specific state transitions
    if (updateData.notesViewed === true) {
      updateData.notesViewedAt = Date.now();
    }
    if (updateData.flashcardsCompleted === true) {
      updateData.flashcardsCompletedAt = Date.now();
    }
    if (updateData.quizCompleted === true) {
      const existing = await Progress.findOne({ documentId });
      if (!existing || existing.quizCompleted === false) {
        incData.quizAttempts = 1; // Increment only on first completion
      }
      updateData.quizCompletedAt = Date.now();
    }
    if (updateData.tutorUsed === true) {
      updateData.tutorUsedAt = Date.now();
    }

    // Ensure bestQuizScore only goes up
    if (updateData.bestQuizScore !== undefined) {
      const existing = await Progress.findOne({ documentId });
      if (existing && existing.bestQuizScore > updateData.bestQuizScore) {
        delete updateData.bestQuizScore;
      }
    }

    const progress = await Progress.findOneAndUpdate(
      { documentId },
      { $set: updateData, $inc: incData },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(progress);
  } catch (error) {
    next(error);
  }
};
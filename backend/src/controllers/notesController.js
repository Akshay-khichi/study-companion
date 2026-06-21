import Notes from '../models/Notes.js';

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Notes.findOne({ document: req.params.id });
    if (!notes) return res.status(404).json({ message: 'Notes not found or still processing' });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};
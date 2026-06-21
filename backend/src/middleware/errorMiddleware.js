export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size limit exceeded. Maximum allowed is 10MB.' });
  }
  
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ message: 'Invalid file type. Only PDF files are allowed.' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation Error', errors: Object.values(err.errors).map(val => val.message) });
  }

  res.status(500).json({ message: 'Internal Server Error', error: err.message });
};

export const notFound = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
};
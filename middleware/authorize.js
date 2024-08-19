module.exports = (getModelById) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const model = await getModelById(id);
    if (!model) {
      return res.status(404).json({ message: 'Not found' });
    }
    if (req.user.role === 'admin' || model.user_id === req.user.id) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
};
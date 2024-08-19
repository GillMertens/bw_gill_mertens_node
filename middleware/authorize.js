module.exports = (getModelById) => {
  return async (req, res, next) => {
    const id = Number(req.params.id);
    const model = await getModelById(id);
    if (!model) {
      return res.status(404).json({ message: 'Not found' });
    }
    let modelId;
    if (model.hasOwnProperty('user_id')) {
      modelId = model.user_id;
    } else {
      modelId = model.id;
    }
    if (req.user.role === 'admin' || modelId === req.user.id) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
};
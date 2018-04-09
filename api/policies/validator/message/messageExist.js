module.exports = asyncWrap(async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMessage = sails.helpers.isMongoId(id);
    if (isMessage) {
      const message = Message.count({ _id: id });
      if (message) {
        return next();
      }
    }
    return res.badRequest({ message: 'Message not found' });
  } catch (error) {
    res.serverError({}, error);
  }
});

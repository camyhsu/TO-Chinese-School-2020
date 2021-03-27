const asyncWrapper = (callback) => (req, res, next) => callback(req, res, next).catch(next);
const another = () => {};

export {
  asyncWrapper, another,
};

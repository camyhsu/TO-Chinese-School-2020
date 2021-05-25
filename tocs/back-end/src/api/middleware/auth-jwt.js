import jwt from 'jsonwebtoken';
import config from 'config';
import { forbidden, unauthorized } from '../../utils/response-factory.js';

const authSecret = config.get('authSecret');

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.accesstoken;
  if (!token) {
    next(forbidden('No token provided!'));
    return;
  }

  jwt.verify(token, authSecret, (err, decoded) => {
    if (err) {
      next(unauthorized('Unauthorized!'));
      return;
    }
    req.userId = decoded.id;
    req.personId = decoded.pid;
    next();
  });
};

export default {
  verifyToken,
};

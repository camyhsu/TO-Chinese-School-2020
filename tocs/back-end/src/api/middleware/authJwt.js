import jwt from 'jsonwebtoken';
import config from 'config';
import db from '../../models/index.js';

const { roleNames } = db.Role.prototype;
const authSecret = config.get('authSecret');
const { User } = db;

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(403).send({
      message: 'No token provided!',
    });
    return;
  }

  jwt.verify(token, authSecret, (err, decoded) => {
    if (err) {
      res.status(401).send({
        message: 'Unauthorized!',
      });
      return;
    }
    req.userId = decoded.id;
    next();
  });
};

const isStudentParent = (req, res, next) => {
  User.getById(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      const foundRole = roles.find((role) => role.name === roleNames.ROLE_NAME_STUDENT_PARENT);
      if (foundRole) {
        next();
      } else {
        res.status(403).send({ message: 'Require Student Parent Role!' });
      }
    });
  });
};

export default {
  verifyToken,
  isStudentParent,
};

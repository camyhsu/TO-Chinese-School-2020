import db from '../../models/index.js';
import { badRequest, duplicateResource } from '../../utils/errors.js';

const { Address, User } = db;

const checkDuplicateUsernameOrEmail = async (req, _res, next) => {
  const { email, username } = req.body;

  try {
    if (!email || !username) {
      throw badRequest('Invalid parameter');
    }
    if (await Address.emailAlreadyExists(email)) {
      throw duplicateResource('Email already exists');
    }
    if (await User.userNameAlreadyExists(username)) {
      throw duplicateResource('UserName already exists');
    }
  } catch (err) {
    next(err);
  }

  next();
};

export default { checkDuplicateUsernameOrEmail };

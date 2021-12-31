import db from "../../models/index.js";
import { badRequest, duplicateResource } from "../../utils/response-factory.js";

const { Address, User } = db;

const checkDuplicateUsernameOrEmail = async (req, _res, next) => {
  const { email, username } = req.body;

  if (!email || !username) {
    next(badRequest("Invalid parameter"));
    return;
  }
  if (await Address.emailAlreadyExists(email)) {
    next(duplicateResource("Email already exists"));
    return;
  }
  if (await User.userNameAlreadyExists(username)) {
    next(duplicateResource("UserName already exists"));
    return;
  }

  next();
};

export default { checkDuplicateUsernameOrEmail };

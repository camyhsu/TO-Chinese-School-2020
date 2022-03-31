import db from "../../models/index";
import { unauthorized } from "../../utils/response-factory";

const { User } = db;

const isActionPermitted = async (req, _res, next) => {
  const user = await User.getById(req.userId);
  const person = await user.getPerson();
  // eslint-disable-next-line eqeqeq
  if (person.id == req.params.id || (await person.isAParentOf(req.params.id))) {
    next();
    return;
  }
  next(unauthorized("Access to requested personal data not authorized"));
};

export default { isActionPermitted };

import db from "../../models/index";
import { unauthorized } from "../../utils/response-factory";

const { Family, User } = db;

const isActionPermitted = async (req, _res, next) => {
  const user = await User.getById(req.userId);
  const person = await user.getPerson();
  if (person && req.params.id) {
    const family = await Family.getById(req.params.id);
    if (family) {
      if (
        (await family.isParentOne(person)) ||
        (await family.isParentTwo(person))
      ) {
        next();
        return;
      }
    }
  }
  next(unauthorized("Access to requested family data not authorized"));
};

export default { isActionPermitted };

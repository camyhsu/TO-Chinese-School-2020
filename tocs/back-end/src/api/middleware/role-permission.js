import db from '../../models/index.js';
import { actionsXRoles } from '../../utils/caches.js';
import { unauthorized } from '../../utils/response-factory.js';

const { Role, User } = db;
const { roleNames } = db.Role.prototype;

const fetchActionsXRoles = async () => {
  const roles = await Role.findAll();
  const ps = roles.map((role) => role.getRights().then((rights) => rights.forEach((right) => {
    const s = `${right.controller}/${right.action}`;
    actionsXRoles.set(s, (actionsXRoles.get(s) || []).concat(role.name));
  })));
  await Promise.all(ps);
};

const isActionPermitted = async (req, _res, next) => {
  const sp = req.path.split('/');
  const action = sp[sp.length - 1];
  const controller = sp.slice(1, sp.length - 1).join('/');
  const str = `${controller}/${action}`;

  const user = await User.getById(req.userId);
  const userRoleNames = (await user.getRoles()).map((role) => role.name);

  if (!actionsXRoles.get(str)) {
    await fetchActionsXRoles();
  }

  const found = (actionsXRoles.get(str) || []).filter((rs) => userRoleNames.includes(rs));

  if (!found.length) {
    next(unauthorized(str));
    return;
  }
  next();
};

const hasRole = async (req, next, roleName) => {
  const user = await User.getById(req.userId);
  if (await user.hasRole(roleName)) {
    next();
    return;
  }
  next(unauthorized(`Require ${roleName}`));
};

const isStudentParent = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_STUDENT_PARENT);

const isInstructor = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_INSTRUCTOR);

export default { isActionPermitted, isInstructor, isStudentParent };

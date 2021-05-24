import db from '../../models/index.js';
import { actionsXRoles } from '../../utils/caches.js';
import { unauthorized } from '../../utils/response-factory.js';

const { Right, Role, User } = db;
const { roleNames } = db.Role.prototype;

const fetchActionsXRoles = async () => {
  const roles = await Role.findAll({ include: [{ model: Right, as: 'rights' }] });
  roles.forEach((role) => {
    role.rights.forEach((right) => {
      const s = `${right.controller}/${right.action}`;
      actionsXRoles.set(s, (actionsXRoles.get(s) || []).concat(role.name));
    });
  });
};

const isActionPermitted = async (req, _res, next) => {
  // Remove trailing ID in path
  const sp = req.path.replace(/\/\d+$/, '').split('/');
  const action = sp[sp.length - 1];
  const controller = sp.slice(1, sp.length - 1).join('/');
  const str = `${controller}/${action}`;

  const user = await User.getById(req.userId);
  const userRoleNames = (await user.getRoles()).map((role) => role.name);
  if (!userRoleNames.includes(roleNames.ROLE_NAME_SUPER_USER)) {
    if (!actionsXRoles.get(str)) {
      await fetchActionsXRoles();
    }
    const found = (actionsXRoles.get(str) || []).filter((rs) => userRoleNames.includes(rs));
    if (!found.length) {
      next(unauthorized(str));
      return;
    }
  }
  next();
};

const hasRole = async (req, next, roleName) => {
  const user = await User.getById(req.userId);
  if (await user.hasRole(roleName) || await user.hasRole(roleNames.ROLE_NAME_SUPER_USER)) {
    next();
    return;
  }
  next(unauthorized(`Require ${roleName}`));
};

const isStudentParent = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_STUDENT_PARENT);

const isPrincipal = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_PRINCIPAL);

const isAcademicVicePrincipal = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_ACADEMIC_VICE_PRINCIPAL);

const isInstructor = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_INSTRUCTOR);

const isRegistrationOfficer = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_REGISTRATION_OFFICER);

const isAccountingOfficer = (req, _res, next) => hasRole(req, next, roleNames.ROLE_NAME_ACCOUNTING_OFFICER);

export default {
  isActionPermitted,
  isInstructor,
  isPrincipal,
  isStudentParent,
  isRegistrationOfficer,
  isAccountingOfficer,
  isAcademicVicePrincipal,
};

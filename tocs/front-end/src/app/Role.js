// These values match the roles in the back-end database
export const Role = {
  ACADEMIC_VICE_PRINCIPAL: "Academic Vice Principal",
  ACCOUNTING_OFFICER: "Accounting Officer",
  ACTIVITY_OFFICER: "Activity Officer",
  CCCA_STAFF: "CCCA Staff",
  COMMUNICATION_OFFICER: "Communication Officer",
  INSTRUCTION_OFFICER: "Instruction Officer",
  INSTRUCTOR: "Instructor",
  LIBRARIAN: "Librarian",
  PRINCIPAL: "Principal",
  PVA: "PVA",
  REGISTRATION_OFFICER: "Registration Officer",
  ROOM_PARENT: "Room Parent",
  STUDENT_PARENT: "Student Parent",
  SUPER_USER: "Super User",
};

export const userHasRequiredRole = (userRoles, requiredRoles) => {
  if (!Array.isArray(userRoles) || userRoles.length < 1) {
    return false;
  }
  if (userRoles.includes(Role.SUPER_USER)) {
    return true;
  }
  if (!Array.isArray(requiredRoles) || requiredRoles.length < 1) {
    return false;
  }
  if (userRoles.some((userRole) => requiredRoles.includes(userRole))) {
    return true;
  }
  return false;
};

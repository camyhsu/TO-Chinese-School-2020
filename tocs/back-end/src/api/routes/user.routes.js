import { rolePermission } from "../middleware/index.js";
import controller from "../controllers/user.controller.js";

export default (router) => {
  router.get(
    "/board/student-parent",
    [rolePermission.isStudentParent],
    controller.studentParentBoard
  );

  router.get(
    "/board/principal",
    [rolePermission.isPrincipal],
    controller.registrationOfficerBoard
  );

  router.get(
    "/board/academic-vice-principal",
    [rolePermission.isAcademicVicePrincipal],
    controller.registrationOfficerBoard
  );

  router.get(
    "/board/instructor",
    [rolePermission.isInstructor],
    controller.instructorBoard
  );

  router.get(
    "/board/registration-officer",
    [rolePermission.isRegistrationOfficer],
    controller.registrationOfficerBoard
  );

  router.get(
    "/board/accounting-officer",
    [rolePermission.isAccountingOfficer],
    controller.accountingOfficerBoard
  );

  router.put("/change-password", [], controller.changePassword);

  router.get("/announcements", [], controller.getAnnouncements);
};

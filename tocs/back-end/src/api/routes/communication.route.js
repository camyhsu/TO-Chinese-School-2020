import controller from "../controllers/communication.controller";

export default (router) => {
  router.get(
    "/communication/forms/student_list_for_yearbook",
    [],
    controller.getStudentYearBookCsv
  );
};

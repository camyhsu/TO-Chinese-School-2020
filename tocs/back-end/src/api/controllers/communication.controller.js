import { registrationService } from "../../services/index";
import { asyncWrapper, downloadCsv } from "./utils";
import { toObj } from "../../utils/utilities";

const fn = async (res) => {
  const fields = [
    {
      label: "Class",
      value: "className",
    },
    {
      label: "Student ID",
      value: "id",
    },
    {
      label: "First Name",
      value: "firstName",
    },
    {
      label: "Last Name",
      value: "lastName",
    },
    {
      label: "Chinese Name",
      value: "chineseName",
    },
    {
      label: "Gender",
      value: "gender",
    },
  ];

  const data = await registrationService.getStudents();
  return downloadCsv(res, "student_list_for_yearbook.csv", fields, toObj(data));
};

export default {
  getStudentYearBookCsv: asyncWrapper(async (_req, res, next) => {
    next(await fn(res));
  }),
};

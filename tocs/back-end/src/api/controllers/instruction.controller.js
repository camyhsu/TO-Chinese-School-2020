import { instructionService } from "../../services/index";
import { response } from "../../utils/response-factory";
import { asyncWrapper } from "./utils";

export default {
  showSchoolClass: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    const { schoolYearId } = req.query;
    next(response(await instructionService.getSchoolClass(id, schoolYearId)));
  }),
};

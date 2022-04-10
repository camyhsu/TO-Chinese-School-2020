import {
  userService,
  registrationService,
  accountingService,
} from "../../services/index";
import { response } from "../../utils/response-factory";
import { asyncWrapper } from "./utils";

export default {
  allAccess: (_req, _res, next) => {
    next(response("Public Content."));
  },
  studentParentBoard: asyncWrapper(async (req, _res, next) => {
    next(response(await userService.studentParentBoard(req.userId)));
  }),
  instructorBoard: asyncWrapper(async (_req, _res, next) => {
    // TODO
    next(response("TO BE IMPLMENTED"));
  }),
  registrationOfficerBoard: asyncWrapper(async (_req, _res, next) => {
    next(response(await registrationService.getBoard()));
  }),
  accountingOfficerBoard: asyncWrapper(async (_req, _res, next) => {
    next(response(await accountingService.getBoard()));
  }),
  changePassword: asyncWrapper(async (req, _res, next) => {
    const { currentPassword, newPassword } = req.body;
    next(
      response(
        await userService.changePassword(req.userId, {
          currentPassword,
          newPassword,
        })
      )
    );
  }),
  getAnnouncements: asyncWrapper(async (req, _res, next) => {
    next(response(await userService.getAnnouncements(req.personId)));
  }),
};

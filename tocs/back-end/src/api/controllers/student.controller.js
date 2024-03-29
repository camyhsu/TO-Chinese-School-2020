import { studentService } from "../../services/index";
import { response, unauthorized } from "../../utils/response-factory";
import { asyncWrapper } from "./utils";

export default {
  addParent: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.params;
    next(response(await studentService.addParent(familyId, req.body)));
  }),
  addChild: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.params;
    next(response(await studentService.addChild(familyId, req.body)));
  }),
  getPerson: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.params;
    next(response(await studentService.getPerson(personId, req.body)));
  }),
  editPerson: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.params;
    next(response(await studentService.savePerson(personId, req.body)));
  }),
  getFamilyAddress: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.params;
    next(response(await studentService.getFamilyAddress(familyId)));
  }),
  editFamilyAddress: asyncWrapper(async (req, _res, next) => {
    const { id: familyId } = req.params;
    next(response(await studentService.saveFamilyAddress(familyId, req.body)));
  }),
  getPersonalAddress: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.params;
    next(response(await studentService.getPersonalAddress(personId)));
  }),
  editPersonalAddress: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.params;
    next(
      response(await studentService.savePersonalAddress(personId, req.body))
    );
  }),
  addPersonalAddress: asyncWrapper(async (req, _res, next) => {
    const { id: personId } = req.params;
    next(response(await studentService.addPersonalAddress(personId, req.body)));
  }),
  getTransactionHistory: asyncWrapper(async (req, _res, next) => {
    next(
      response(await studentService.getTransactionHistoryByUser(req.userId))
    );
  }),
  getRegistrationPayment: asyncWrapper(async (req, _res, next) => {
    const { personId } = req;
    const { id } = req.params;
    const { registrationPayment } = await studentService.getRegistrationPayment(
      id
    );
    if (personId !== registrationPayment.paid_by_id) {
      next(
        unauthorized("Access to requested payment confirmation not authorized")
      );
      return;
    }
    next(response(registrationPayment));
  }),
  getRegistrationPaymentForStaff: asyncWrapper(async (req, _res, next) => {
    const { id } = req.params;
    const { registrationPayment } = await studentService.getRegistrationPayment(
      id
    );
    next(response(registrationPayment));
  }),
  getStudentRegistrationDisplayOptions: asyncWrapper(
    async (req, _res, next) => {
      const { personId } = req;
      const { schoolYearId } = req.query;
      next(
        response(
          await studentService.getStudentRegistrationDisplayOptions(
            schoolYearId,
            personId
          )
        )
      );
    }
  ),
  saveRegistrationPreferences: asyncWrapper(async (req, _res, next) => {
    const { personId } = req;
    next(
      response(
        await studentService.saveRegistrationPreferences(personId, req.body)
      )
    );
  }),
  initializeRegistrationPayment: asyncWrapper(async (req, _res, next) => {
    const { personId } = req;
    next(
      response(
        await studentService.initializeRegistrationPayment(personId, req.body)
      )
    );
  }),
  savePayment: asyncWrapper(async (req, _res, next) => {
    const { personId } = req;
    const { id } = req.params;
    next(response(await studentService.savePayment(personId, id, req.body)));
  }),
};

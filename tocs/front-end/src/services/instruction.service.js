import dataService from "./data.service";

const getActiveSchoolClasses = () =>
  dataService.get("instruction/active_school_classes/index");

const getSchoolClass = (id, schoolYearId) =>
  dataService.get(
    `instruction/school_classes/show/${id}?schoolYearId=${schoolYearId}`
  );

const obj = {
  getActiveSchoolClasses,
  getSchoolClass,
};

export default obj;

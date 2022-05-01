import db from "../models/index";
import { formatAddressPhoneNumbers } from "../utils/mutator";
import {
  nowIsAfterPacificDate,
  nowIsBeforePacificDate,
} from "../utils/pacific-date-time";
import { badRequest, unauthorized } from "../utils/response-factory";

const { Address, Person, User, SchoolYear } = db;

const inActiveRegistration = (schoolYear) => {
  if (
    nowIsBeforePacificDate(schoolYear.earlyRegistrationStartDate) ||
    nowIsAfterPacificDate(schoolYear.registrationEndDate)
  ) {
    return false;
  }
  if (
    nowIsAfterPacificDate(schoolYear.earlyRegistrationEndDate) &&
    nowIsBeforePacificDate(schoolYear.registrationStartDate)
  ) {
    return false;
  }
  return true;
};

const findActiveRegistrationSchoolYear = async () => {
  const [currentSchoolYear, nextSchoolYear] =
    await SchoolYear.findCurrentAndFutureSchoolYears();
  // assume only one school year can be in the active registration state
  if (currentSchoolYear && inActiveRegistration(currentSchoolYear)) {
    return currentSchoolYear;
  }
  if (nextSchoolYear && inActiveRegistration(nextSchoolYear)) {
    return nextSchoolYear;
  }
  return null;
};

const findPreviousClassTrack = async (
  activeRegistrationSchoolYear,
  students
) => {
  const classTrackTypes = [];
  const queryPromises = students.map(async (student) => {
    const previousSchoolYearClassAssignment =
      await student.getStudentClassAssignmentForSchoolYear(
        activeRegistrationSchoolYear.previousSchoolYearId
      );
    if (
      previousSchoolYearClassAssignment &&
      previousSchoolYearClassAssignment.schoolClass
    ) {
      classTrackTypes.push(
        previousSchoolYearClassAssignment.schoolClass.schoolClassType
      );
    }
  });
  await Promise.all(queryPromises);
  if (classTrackTypes.length > 0) {
    // return the first one, whichever it is
    return classTrackTypes[0];
  }
  return null;
};

export default {
  changePassword: async (userId, { currentPassword, newPassword }) => {
    if (!userId || !currentPassword || !newPassword) {
      throw badRequest("Invalid request parameters!");
    }
    const user = await User.getById(userId);
    if (!user.passwordCorrect(currentPassword)) {
      throw unauthorized("Invalid current password!");
    }
    user.setPassword(newPassword);
    await user.save();
    return "Password changed successfully.";
  },
  studentParentBoard: async (personId) => {
    const person = await Person.findByPk(personId, {
      include: [{ model: Address, as: "address" }],
    });
    // Returns only the first family since most likely there will be only one
    // TODO - a lot of code to clean-up in the model for really switching to
    // only one family per person mapping
    const family = (await person.families())[0];

    const activeRegistrationSchoolYear =
      await findActiveRegistrationSchoolYear();
    let previousClassTrack = null;
    if (activeRegistrationSchoolYear && family.children) {
      previousClassTrack = await findPreviousClassTrack(
        activeRegistrationSchoolYear,
        family.children
      );
    }
    const registrationStarter = {
      school_year_id: activeRegistrationSchoolYear.id,
      school_year_name: activeRegistrationSchoolYear.name,
      existingClassTrack: previousClassTrack,
    };
    const result = formatAddressPhoneNumbers(
      JSON.parse(
        JSON.stringify({
          person,
          family,
          registrationStarter,
        })
      )
    );
    return result;
  },
  getAnnouncements: async (personId) => {
    const person = await Person.getById(personId);
    const children = await person.findChildren();
    const activeSchoolYears =
      await SchoolYear.findActiveRegistrationSchoolYears();
    return {
      children,
      activeSchoolYears,
    };
  },
};

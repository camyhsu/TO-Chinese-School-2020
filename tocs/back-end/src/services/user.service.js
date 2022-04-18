import db from "../models/index";
import { formatAddressPhoneNumbers } from "../utils/mutator";
import { badRequest, unauthorized } from "../utils/response-factory";

const { Address, Person, User, SchoolYear } = db;

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
    const result = formatAddressPhoneNumbers(
      JSON.parse(JSON.stringify({ person, family }))
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

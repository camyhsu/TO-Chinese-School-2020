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
  studentParentBoard: async (userId) => {
    const users = await User.findAll({
      where: { id: userId },
      include: [
        {
          model: Person,
          as: "person",
          include: [{ model: Address, as: "address" }],
        },
      ],
    });
    const { person } = users[0];
    const families = await person.families();
    const result = formatAddressPhoneNumbers(
      JSON.parse(JSON.stringify({ person, families }))
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

import db from '../models/index.js';
import { formatAddressPhoneNumbers } from '../utils/mutator.js';
import { badRequest } from '../utils/response-factory.js';

const {
  Address, Person, User,
} = db;

export default {
  changePassword: async (userId, {
    currentPassword, newPassword, newPasswordConfirmation,
  }) => {
    if (!userId || !currentPassword || !newPassword || !newPasswordConfirmation
      || newPassword !== newPasswordConfirmation) {
      throw badRequest('Invalid password');
    }
    const user = await User.getById(userId);
    if (!user.passwordCorrect(currentPassword)) {
      throw badRequest('Invalid password');
    }
    user.setPassword(newPassword);
    await user.save();
    return 'Password changed successfully.';
  },
  studentParentBoard: async (userId) => {
    const users = await User.findAll({
      where: { id: userId },
      include: [{ model: Person, as: 'person', include: [{ model: Address, as: 'address' }] }],
    });
    const { person } = users[0];
    const families = await person.families();
    const result = formatAddressPhoneNumbers(JSON.parse(JSON.stringify({ person, families })));
    return result;
  },
};

import { authService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';

export default {
  signUp: async (req, res, next) => {
    const {
      lastName, firstName, chineseName, nativeLanguage, gender,
      birthYear, birthMonth, street, city, state, zip, homePhone,
      cellPhone, email, username, password,
    } = req.body;
    try {
      await authService.signUp({
        lastName,
        firstName,
        chineseName,
        nativeLanguage,
        gender,
        birthYear,
        birthMonth,
        street,
        city,
        state,
        zip,
        homePhone,
        cellPhone,
        email,
        username,
        password,
      });
      next(response({ message: 'Account successfully created' }));
    } catch (err) {
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await authService.signIn({ username, password });
      console.log('signIn', user);
      next(response(user));
    } catch (err) {
      next(err);
    }
  },
};

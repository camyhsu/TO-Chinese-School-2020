import { authService } from '../../services/index.js';

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
      res.send({ message: 'Account successfully created' });
    } catch (err) {
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await authService.signIn({ username, password });
      console.log('signIn', user);
      res.status(200).send(user);
    } catch (err) {
      next(err);
    }
  },
};

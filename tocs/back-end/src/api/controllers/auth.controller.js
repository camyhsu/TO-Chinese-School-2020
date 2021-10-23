import { authService } from '../../services/index.js';
import { response } from '../../utils/response-factory.js';
import { asyncWrapper } from './utils.js';
import logger from '../../utils/logger.js';

export default {
  signUp: asyncWrapper(async (req, _res, next) => {
    const {
      lastName, firstName, chineseName, nativeLanguage, gender,
      birthYear, birthMonth, street, city, state, zipcode, homePhone,
      cellPhone, email, username, password,
    } = req.body;
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
      zipcode,
      homePhone,
      cellPhone,
      email,
      username,
      password,
    });
    next(response({ message: 'Account successfully created' }));
  }),
  signIn: asyncWrapper(async (req, _res, next) => {
    const { username, password } = req.body;

    const user = await authService.signIn({ username, password });
    logger.info(`signIn ${JSON.stringify(user)}`);
    next(response(user));
  }),
};

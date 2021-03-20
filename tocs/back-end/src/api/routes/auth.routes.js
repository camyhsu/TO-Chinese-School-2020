import { verifySignUp } from '../middleware/index.js';
import controller from '../controllers/auth.controller.js';

export default (app) => {
  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.signUp,
  );

  app.post('/api/auth/signin', controller.signIn);
};

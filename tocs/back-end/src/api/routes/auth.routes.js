import { verifySignUp } from '../middleware/index.js';
import controller from '../controllers/auth.controller.js';

export default (router) => {
  router.get('/', (req, res) => res.json({ message: 'Welcome to Thousand Oaks Chinese School.' }));

  router.post(
    '/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.signUp,
  );

  router.post('/signin', controller.signIn);
};

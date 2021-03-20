import { userService } from '../../services/index.js';

export default {
  allAccess: (req, res) => {
    res.status(200).send('Public Content.');
  },
  userBoard: (req, res) => {
    res.status(200).send('User Content.');
  },
  adminBoard: (req, res) => {
    res.status(200).send('Admin Content.');
  },
  studentParentBoard: async (req, res) => {
    res.status(200).send(await userService.studentParentBoard(req.userId));
  },
};

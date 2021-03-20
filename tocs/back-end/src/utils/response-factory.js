const fn = (statusCode) => (message) => Object.assign(new Error(message), { status: statusCode });

const badRequest = fn(400);
const dataNotFound = fn(404);
const duplicateResource = fn(409);
const forbidden = fn(401);
const loginError = fn(401);
const unauthorized = fn(403);
const response = (obj) => ({ status: 200, rtnObj: obj });

export {
  badRequest, dataNotFound, duplicateResource, forbidden, loginError, unauthorized, response,
};

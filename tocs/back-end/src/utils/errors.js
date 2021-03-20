const fn = (statusCode) => (message) => Object.assign(new Error(message), { status: statusCode });

const badRequest = fn(400);
const dataNotFound = fn(404);
const duplicateResource = fn(409);
const loginError = fn(401);

export {
  badRequest, dataNotFound, duplicateResource, loginError,
};

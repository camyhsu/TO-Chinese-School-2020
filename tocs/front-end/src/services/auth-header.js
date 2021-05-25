const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  }

  return {};
};

const accessToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return (user && user.accessToken) || null;
}

export {
  authHeader, accessToken
}
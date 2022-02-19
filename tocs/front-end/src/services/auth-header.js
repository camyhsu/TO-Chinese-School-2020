const authHeader = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user && user.accessToken) {
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
};

const accessToken = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return (user && user.accessToken) || null;
};

export { authHeader, accessToken };

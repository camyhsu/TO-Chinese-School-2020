import axios from "axios";
import config from "../../app/config";

export const SignUpStatus = {
  EMAIL_CONFLICT: "emailConflict",
  IDLE: "idle",
  PENDING: "pending",
  SIGN_UP_FAILED: "signUpFailed",
  SIGN_UP_SUCCESSFUL: "signUpSuccessful",
  USERNAME_CONFLICT: "usernameConflict",
};

export const userSignUp = async (signUpData) => {
  try {
    const response = await axios.post(`${config.apiUrl}/signup`, signUpData);
    if (response.status === 200) {
      return SignUpStatus.SIGN_UP_SUCCESSFUL;
    }
  } catch (error) {
    if (error.response?.status === 409) {
      const errorMessageFromSignUpResponse = error.response.data.message;
      if (errorMessageFromSignUpResponse.includes("Email")) {
        return SignUpStatus.EMAIL_CONFLICT;
      } else if (errorMessageFromSignUpResponse.includes("UserName")) {
        return SignUpStatus.USERNAME_CONFLICT;
      }
    }
    return SignUpStatus.SIGN_UP_FAILED;
  }
};

import dataService from "../../services/data.service";

export const ChangePasswordStatus = {
  FAILED: "changePasswordFailed",
  SUCCESSFUL: "changePasswordSuccessful",
  INCORRECT_CURRENT: "incorrectCurrentPassword",
  IDLE: "changePasswordIdle",
  PENDING: "changePasswordPending",
};

export const changePasswordRequest = async (data) => {
  try {
    const response = await dataService.put("change-password", data);
    if (response.status === 200) {
      return ChangePasswordStatus.SUCCESSFUL;
    }
  } catch (error) {
    if (error.response?.status === 403) {
      return ChangePasswordStatus.INCORRECT_CURRENT;
    }
    return ChangePasswordStatus.FAILED;
  }
};

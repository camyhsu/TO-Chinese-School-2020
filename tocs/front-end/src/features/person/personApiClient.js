import dataService from "../../services/data.service";

export const GetPersonStatus = {
  FAILED: "getPersonFailed",
  SUCCESSFUL: "getPersonSuccessful",
  IDLE: "getPersonIdle",
  NOT_AUTHORIZED: "getPersonNotAuthorized",
  PENDING: "getPersonPending",
};

export const UpdatePersonStatus = {
  FAILED: "updatePersonFailed",
  SUCCESSFUL: "updatePersonSuccessful",
  IDLE: "updatePersonIdle",
  NOT_AUTHORIZED: "updatePersonNotAuthorized",
  PENDING: "updatePersonPending",
};

export const getPersonRequest = async (personId) => {
  try {
    const response = await dataService.get(`student/people/edit/${personId}`);
    if (response.status === 200) {
      return { status: GetPersonStatus.SUCCESSFUL, data: response.data };
    }
  } catch (error) {
    if (error.response?.status === 403) {
      return { status: GetPersonStatus.NOT_AUTHORIZED };
    }
    return { status: GetPersonStatus.FAILED };
  }
};

export const updatePersonRequest = async (personId, data) => {
  try {
    const response = await dataService.put(
      `student/people/edit/${personId}`,
      data
    );
    if (response.status === 200) {
      return UpdatePersonStatus.SUCCESSFUL;
    }
  } catch (error) {
    if (error.response?.status === 403) {
      return UpdatePersonStatus.NOT_AUTHORIZED;
    }
    return UpdatePersonStatus.FAILED;
  }
};

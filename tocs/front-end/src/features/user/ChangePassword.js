import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Card, CardBody, CardFooter, CardTitle } from "../../components/Cards";
import { ProgressSpinner } from "../../components/decorationElements";
import { passwordValidation } from "../../utils/formFieldOptions";
import {
  changePasswordRequest,
  ChangePasswordStatus,
} from "./changePasswordApiClient";

export const ChangePassword = () => {
  const {
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.title = "TOCS - Change Password";
  }, []);

  const [changePasswordStatus, setChangePasswordStatus] = useState(
    ChangePasswordStatus.IDLE
  );

  const submitHandler = async (data) => {
    setChangePasswordStatus(ChangePasswordStatus.PENDING);
    const changePasswordData = { ...data };
    delete changePasswordData.confirmPassword;
    const responseFromServer = await changePasswordRequest(data);
    if (responseFromServer === ChangePasswordStatus.SUCCESSFUL) {
      reset();
    }
    setChangePasswordStatus(responseFromServer);
  };

  let changePasswordFailed = false;
  let changePasswordErrorMessage = null;
  if (changePasswordStatus === ChangePasswordStatus.INCORRECT_CURRENT) {
    changePasswordFailed = true;
    changePasswordErrorMessage =
      "Change Password Failed - incorrect current password";
  } else if (changePasswordStatus === ChangePasswordStatus.FAILED) {
    changePasswordFailed = true;
    changePasswordErrorMessage = "Server Unavailable - please try again later";
  }

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div>
            <CardTitle>Change Password</CardTitle>
            <div className="row">
              <div className="form-group col-md-12 mb-3">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  {...register("currentPassword", passwordValidation)}
                  type="password"
                  placeholder="current password"
                  className={`form-control ${
                    errors.currentPassword ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.currentPassword?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 mb-3">
                <label htmlFor="newPassword">New Password</label>
                <input
                  {...register("newPassword", passwordValidation)}
                  type="password"
                  placeholder="new password"
                  className={`form-control ${
                    errors.newPassword ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.newPassword?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 mb-3">
                <label htmlFor="confirmPassword">Re-type New Password</label>
                <input
                  {...register("confirmPassword", {
                    required: "Required!",
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      "Password does not match!",
                  })}
                  type="password"
                  placeholder="new password again"
                  className={`form-control ${
                    errors.confirmPassword ? "is-invalid" : ""
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.confirmPassword?.message}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-12 mt-3 mb-3">
                <button className="btn btn-primary btn-block">
                  {changePasswordStatus === ChangePasswordStatus.PENDING && (
                    <ProgressSpinner />
                  )}
                  <span>Change Password</span>
                </button>
              </div>
            </div>
            <div className="form-group">
              {changePasswordStatus === ChangePasswordStatus.SUCCESSFUL && (
                <div className="alert alert-success" role="alert-success">
                  {"Password changed successfully"}
                </div>
              )}
            </div>
            <div className="form-group">
              {changePasswordFailed && (
                <div className="alert alert-danger" role="alert-error">
                  {changePasswordErrorMessage}
                </div>
              )}
            </div>
          </div>
        </form>
      </CardBody>
      <CardFooter>
        Back to <Link to={"/account"}>Account</Link>
      </CardFooter>
    </Card>
  );
};

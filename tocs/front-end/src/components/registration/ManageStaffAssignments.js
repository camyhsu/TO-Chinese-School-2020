import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RegistrationService from "../../services/registration.service";
import { Card, CardBody } from "../Cards";

const ManageStaffAssignments = () => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    items: [],
  });

  useEffect(() => {
    document.title = "TOCS - Home";

    RegistrationService.getManageStaffAssignments().then(
      (response) => {
        const schoolYears = response.data;
        setContent({
          isLoaded: true,
          items: schoolYears,
        });
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent({
          isLoaded: true,
          error: { message: _content },
        });
      }
    );
  }, []);

  return (
    <Card size="medium">
      <CardBody>
        {content &&
          content.items &&
          content.items.map((schoolYear, index) => {
            return (
              <React.Fragment key={"schoolYear-" + index}>
                <div className="row">
                  <div className="col-md-12 mb-3 text-center">
                    <Link
                      to={"/admin/manage-staff-assignment/" + schoolYear.id}
                      className="btn btn-light"
                    >
                      Show Staff Assignment for {schoolYear.name}
                    </Link>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </CardBody>
    </Card>
  );
};

export default ManageStaffAssignments;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../Table";
import RegistrationService from "../../services/registration.service";
import { yesOrNo, BiInfoCircle, BiPlus, BiToggle } from "../../utils/utilities";
import { Card, CardBody } from "../Cards";

const Home = () => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    items: [],
  });
  const [reload, setReload] = useState(null);
  const header = [
    {
      cell: (row) => (
        <Link
          to={"/admin/school-year-details?id=" + row.id}
          className="btn btn-light"
        >
          <BiInfoCircle />
        </Link>
      ),
    },
    { title: "Name", prop: "name", sortable: true },
    { title: "Description", prop: "description" },
    { title: "Start Date", prop: "startDate" },
    { title: "End Date", prop: "endDate" },
    {
      title: "Assign Class Upon Registration",
      cell: (row) => {
        return (
          <>
            <button
              className="btn btn-light"
              onClick={() => toggleAutoClassAssignment(row.id)}
            >
              <BiToggle on={row.autoClassAssignment} />
            </button>
            &nbsp;&nbsp;{yesOrNo(row.autoClassAssignment)}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    document.title = "TOCS - Home";

    RegistrationService.getSchoolYears().then(
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
  }, [reload]);

  const toggleAutoClassAssignment = (id) => {
    RegistrationService.toggleAutoClassAssignment(id).then(
      (response) => {
        setReload(response.data);
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
  };

  return (
    <Card size="flex">
      <CardBody>
        <div className="row">
          <div className="col-md-3">
            <Link to="/school-year-form" className="btn btn-light">
              <BiPlus /> School Year
            </Link>
          </div>
        </div>
        <Table
          header={header}
          items={content.items}
          isLoaded={content.isLoaded}
          error={content.error}
          sortKey="name"
          showAll="true"
        />
      </CardBody>
    </Card>
  );
};

export default Home;

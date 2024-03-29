import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import RegistrationService from "../../services/registration.service";
import {
  BiPlus,
  BiPencil,
  BiInfoCircle,
  formatPersonNames,
  Children,
  isoToPacific,
} from "../../utils/utilities";
import { Card, CardBody, CardTitle, CardFooter } from "../Cards";
import Address from "../Address";
import { Person } from "../../features/person/Person";
import Table from "../Table";

const PersonDetails = () => {
  const { personId } = useParams();
  const [reload, setReload] = useState(null);
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    item: [],
  });
  const dispatch = useDispatch();
  const header = [
    {
      cell: (row) => {
        const transactionType = row.transactionType;
        if (
          transactionType === "System Adjustment" ||
          transactionType === "Registration"
        ) {
          return (
            <Link
              to={"/student/registration-payment/staff/" + row.id}
              className="btn btn-light"
            >
              <BiInfoCircle />
            </Link>
          );
        }
        return (
          <Link
            to={"/student/registration-payment/parent/" + row.id}
            className="btn btn-light"
          >
            <BiInfoCircle />
          </Link>
        );
      },
    },
    { title: "Date", cell: (row) => isoToPacific(row.date) },
    { title: "Type", prop: "transactionType" },
    { title: "Payment Method", prop: "paymentMethod" },
  ];
  useEffect(() => {
    if (personId) {
      RegistrationService.getPerson(personId).then((response) => {
        if (response && response.data) {
          const { person, families, instructorAssignments, transactions } =
            response.data;
          setContent({
            isLoaded: true,
            person,
            families,
            instructorAssignments,
            transactions,
          });
        }
      });
    }
  }, [dispatch, personId, reload]);

  const deleteInstructorAssignment = (id) => {
    RegistrationService.deleteInstructorAssignment(id).then(
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
    <div className="card-deck justify-content-center justify-content-xl-start">
      <Card size="medium" plain="true">
        <CardBody>
          <CardTitle>Person</CardTitle>
          <Person {...content.person} />
          <Address {...(content.person && content.person.address)} />
        </CardBody>
        <CardFooter>
          <div className="row text-truncate">
            <div className="col-md-5 mb-3 mb-md-0">
              {content.person && (
                <Link
                  to={`/person-form/${content.person.id}/none/false/true`}
                  className="btn btn-light"
                >
                  <BiPencil /> Person Details
                </Link>
              )}
            </div>
            <div className="col-md-7 text-md-right">
              {content.person && !content.person.addressId && (
                <Link
                  to={`/address-form/none/${content.person.id}/none/true`}
                  className="btn btn-light"
                >
                  <BiPlus /> Personal Address
                </Link>
              )}
              {content.person && content.person.addressId && (
                <Link
                  to={`/address-form/${content.person.addressId}/${content.person.id}/none/true`}
                  className="btn btn-light"
                >
                  <BiPencil /> Personal Address
                </Link>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>

      {content.families &&
        content.families.map((family, findex) => {
          return (
            <React.Fragment key={"family-" + findex}>
              <div className="w-100 d-block d-xl-none pt-1">&nbsp;</div>
              <Card size="medium" plain="true">
                <CardBody>
                  <CardTitle>
                    Family for <br className="d-md-none" />
                    {family.name}
                  </CardTitle>
                  <dl className="row">
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      Parent One:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      {formatPersonNames(family.parentOne)}
                    </dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      Parent Two:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      {formatPersonNames(family.parentTwo)}
                    </dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      Children:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      <Children children={family.children} />
                    </dd>
                  </dl>
                  <Address {...family.address} />
                </CardBody>
                <CardFooter>
                  <div className="row text-truncate">
                    <div className="col-md-5 mb-3 mb-md-0">
                      <Link
                        to={`/registration/family/${family.id}`}
                        className="btn btn-light"
                      >
                        <BiPencil /> Family Data
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </React.Fragment>
          );
        })}

      <Card size="medium" plain="true">
        <CardBody>
          <CardTitle>
            Transation History as Student for{" "}
            {formatPersonNames(content.person)}
          </CardTitle>
          {content.transactions && (
            <Table
              header={header}
              items={content.transactions}
              isLoaded={content.isLoaded}
              error={content.error}
              sortKey="id"
              showAll="true"
            />
          )}
        </CardBody>
      </Card>

      {content.instructorAssignments &&
        content.instructorAssignments.map((instructorAssignment, index) => {
          return (
            <React.Fragment key={"instructorAssignment-" + index}>
              <Card size="medium" plain="true">
                <CardBody>
                  <CardTitle>
                    Instructor Assignment for <br className="d-md-none" />
                    {formatPersonNames(content.person)}
                  </CardTitle>
                  <dl className="row">
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      School Year:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      {instructorAssignment.schoolYear.name}
                    </dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      School Class:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      {instructorAssignment.schoolClass.chineseName}
                    </dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      Start Date:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      {instructorAssignment.startDate}
                    </dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      End Date:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      {instructorAssignment.endDate}
                    </dd>
                    <dt className="col-12 col-md-6 text-left text-md-right">
                      Role:
                    </dt>
                    <dd className="col-12 col-md-6 text-left border-bottom border-md-bottom-0">
                      {instructorAssignment.role}
                    </dd>
                  </dl>
                </CardBody>
                <CardFooter>
                  <div className="row text-truncate">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <Link
                        to={`/registration/instructor-assignment/${personId}/${instructorAssignment.id}`}
                        className="btn btn-light"
                      >
                        <BiPencil /> Instructor Assignment
                      </Link>
                    </div>
                    <div className="col-md-6 mb-3 mb-md-0 text-md-right">
                      <button
                        className="btn btn-primary btn-light"
                        onClick={() =>
                          deleteInstructorAssignment(instructorAssignment.id)
                        }
                      >
                        Remove This
                      </button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </React.Fragment>
          );
        })}

      <Card size="medium" plain="true">
        <CardTitle>Available Actions</CardTitle>
        <CardBody>
          <div className="row">
            <div className="col-md-6">
              <Link
                to={"/registration/instructor-assignment/" + personId + "/new"}
                className="btn btn-light"
              >
                <BiPlus />
                Instructor Assignment
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PersonDetails;

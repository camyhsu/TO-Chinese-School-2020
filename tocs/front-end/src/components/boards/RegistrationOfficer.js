import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import {
  ListAllGrades, ListAllSchoolClasses, ManageSchoolYears, CreateANewFamily,
  ListAllPeople, ListActiveSchoolClasses, ListActiveSchoolClassGradeCount, ListActiveStudentsByName,
  ListSiblingInSameGradeReport, ProcessInPersonRegistrationPayments
} from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    document.title = 'TOCS - Home';

    UserService.getRegistrationOfficerBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        console.log(_content);
      }
    );
  }, []);

  return (
    <Card size="medium" plain="true">
      <CardBody>
        <CardTitle>Registration Officer Resources</CardTitle>
        <div className="row">
          <div className="col-md-12"><ProcessInPersonRegistrationPayments /></div>
        </div>
        <div className="row">
          <div className="col-md-6"><ListAllGrades /></div>
          <div className="col-md-6"><ListAllSchoolClasses /></div>
          <div className="col-md-6"><ManageSchoolYears /></div>
          <div className="col-md-6"><CreateANewFamily /></div>
          <div className="col-md-6"><ListAllPeople /></div>
          <div className="col-md-8"><ListActiveStudentsByName /></div>

          {content.currentSchoolYear && (
            <>
              <div className="col-md-8"><ListSiblingInSameGradeReport schoolYear={content.currentSchoolYear} /></div>
              <div className="col-md-8"><ListActiveSchoolClasses schoolYear={content.currentSchoolYear} /></div>
              <div className="col-md-8"><ListActiveSchoolClassGradeCount schoolYear={content.currentSchoolYear} /></div>
            </>
          )}
          {content.nextSchoolYear && (
            <>
              <div className="col-md-8"><ListActiveSchoolClasses schoolYear={content.nextSchoolYear} /></div>
              <div className="col-md-8"><ListActiveSchoolClassGradeCount schoolYear={content.nextSchoolYear} /></div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default Home;
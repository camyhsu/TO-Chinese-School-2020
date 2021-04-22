import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../Table';
import RegistrationService from '../../services/registration.service';
import { yesOrNo, BiPencil, BiPlus, BiToggle } from '../../utils/utilities';
import { Card, CardBody } from "../Cards";

const Home = () => {
  const [content, setContent] = useState({ error: null, isLoaded: false, items: [] });
  const [activeSchoolClasses, setActiveSchoolClasses] = useState({});
  const [reload, setReload] = useState(null);
  const header = [
    {
        cell: (row) => <Link to={'/school-class-form?id=' + row.id} className='btn btn-light'><BiPencil/></Link>
    },
    { title: 'English Name', prop: 'englishName', sortable: true },
    { title: 'Chinese Name', prop: 'chineseName', sortable: true },
    { title: 'Short Name', prop: 'shortName', sortable: true },
    { title: 'Description', prop: 'description' },
    { title: 'Location', prop: 'location' },
    { title: 'Type', prop: 'schoolClassType' },
    { title: 'Maximum Size', prop: 'maxSize' },
    { title: 'Maximum Age', prop: 'maxAge' },
    { title: 'Minimum Age', prop: 'minAge' },
    { title: 'Grade', cell: (row) => row && row.grade && row.grade.chineseName },
  ];

  if (activeSchoolClasses.currentSchoolYear) {
    header.push({ title: `${activeSchoolClasses.currentSchoolYear.name} Active?`, cell: (row) => {
      const active = !!activeSchoolClasses.currentSchoolYear.classes.includes(row.id);
      return activeSchoolClasses.currentSchoolYear && (
        <>
          <button className='btn btn-light' onClick={() => toggleActiveSchoolClass(row.id, activeSchoolClasses.currentSchoolYear.id, !active)}><BiToggle on={active}/></button>
          &nbsp;&nbsp;{yesOrNo(active)}
        </>
      );
    }});
  }

  if (activeSchoolClasses.nextSchoolYear) {
    header.push({ title: `${activeSchoolClasses.nextSchoolYear.name} Active?`, cell: (row) => {
      const active = !!activeSchoolClasses.nextSchoolYear.classes.includes(row.id);
      return activeSchoolClasses.nextSchoolYear && (
        <>
          <button className='btn btn-light' onClick={() => toggleActiveSchoolClass(row.id, activeSchoolClasses.nextSchoolYear.id, !active)}><BiToggle on={active}/></button>
          &nbsp;&nbsp;{yesOrNo(active)}
        </>
      );
    }});
  }

  useEffect(() => {
    document.title = 'TOCS - Home';

    RegistrationService.getActiveSchoolClassesForCurrentNextSchoolYear().then(
      (response) => {
        setActiveSchoolClasses(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(_content);
      }
    );

    RegistrationService.getSchoolClasses().then(
      (response) => {
        const schoolClasses = response.data;
        setContent({
          isLoaded: true,
          items: schoolClasses
        });
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent({
          isLoaded: true,
          error: { message: _content }
        });
      }
    );
  }, [reload]);

  const toggleActiveSchoolClass = (id, schoolYearId, active) => {
    RegistrationService.toggleActiveSchoolClass(id, schoolYearId, active).then(
      (response) => {
        setReload(new Date());
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent({
          isLoaded: true,
          error: { message: _content }
        });
      }
    );
  };

  return (
    <Card size="flex">
        <CardBody>
          <div className="row">
            <div className="col-md-3">
              <Link to="/school-class-form" className="btn btn-light"><BiPlus/> School Class</Link>
            </div>
          </div>
          <Table wrapHeader={true} header={header} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="englishName" rowsPerPage="25" />
        </CardBody>
    </Card>
  );
};

export default Home;
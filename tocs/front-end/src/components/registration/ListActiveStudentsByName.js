import React, { useState, useEffect } from 'react';
import Table from '../Table';
import RegistrationService from '../../services/registration.service';
import { Card, CardBody } from "../Cards";

const ListActiveStudentsByName = ({ location } = {}) => {
    const [content, setContent] = useState({ error: null, isLoaded: false, items: [] });
    const header = [
        { title: 'Last Name', cell: (row) => row.student.lastName },
        { title: 'First Name', cell: (row) => row.student.firstName },
        { title: '姓名', cell: (row) => row.student.chineseName },
        { title: '班級', cell: (row) => row.schoolClass.shortName },
        { title: '教室', cell: (row) => row.schoolClass.location },
        { title: '第三堂選修課', cell: (row) => row.electiveClass && row.electiveClass.chineseName},
        { title: '第三堂選修課教室', cell: (row) => row.electiveClass && row.electiveClass.location}
      ];

    useEffect(() => {
        document.title = 'TOCS - Home';
        RegistrationService.getActiveStudentsByName().then((response) => {
            if (response && response.data) {
                setContent({
                    isLoaded: true,
                    items: response.data,
                })
            }
        });
    }, [location.search]);

    return (
        <Card size="flex">
            <CardBody>
                <Table header={header} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="id" showAll="true" />
            </CardBody>
        </Card>
    );
};

export default ListActiveStudentsByName;
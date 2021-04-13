import React, { useState, useEffect } from 'react';
import Table from '../Table';
import queryString from 'query-string';
import RegistrationService from '../../services/registration.service';
import { formatPersonNames } from '../../utils/utilities';
import { Card, CardBody } from "../Cards";

const ManageStaffAssignment = ({ location } = {}) => {
    const [content, setContent] = useState({ error: null, isLoaded: false, items: [] });
    const header = [
        { title: 'Name', cell: (row) => {
            return formatPersonNames({ chineseName: row.person.chineseName, firstName: row.person.firstName, lastName: row.person.lastName });
        }, },
        { title: 'Role', prop: 'role' },
        { title: 'Start Date', prop: 'startDate' },
        { title: 'End Date', prop: 'endDate' }
      ];

    useEffect(() => {
        document.title = 'TOCS - Home';

        const { id } = queryString.parse(location.search);
        if (id) {
            RegistrationService.getManageStaffAssignment(id).then((response) => {
                if (response && response.data) {
                    setContent({
                        isLoaded: true,
                        items: response.data.staffAssignments,
                        schoolYear: response.data.schoolYear
                    })
                }
            });
        }
    }, [location.search]);

    return (
        <Card size="flex">
            <CardBody>
                {content.schoolYear && (<h4>Staff Assignments for {content.schoolYear.name}</h4>)}
                <Table header={header} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="id" showAll="true" />
            </CardBody>
        </Card>
    );
};

export default ManageStaffAssignment;
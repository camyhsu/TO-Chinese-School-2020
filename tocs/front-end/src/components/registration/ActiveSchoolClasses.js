import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import RegistrationService from '../../services/registration.service';
import { formatPersonNames } from '../../utils/utilities';
import { Card, CardTitle, CardBody } from "../Cards";
import Table from '../Table';

const ActiveSchoolClasses = ({ location } = {}) => {
    const [content, setContent] = useState({ error: null, isLoaded: false, item: [] });
    const header = [
        { title: 'Class Name', prop: 'chineseName' },
        { title: 'English Name', prop: 'englishName' },
        { title: 'Location', prop: 'location' },
        {
            title: 'Primary Instructor', cell: (row) => {
                if (row.instructorAssignments) {
                    const instructors = row.instructorAssignments['Primary Instructor'];
                    if (instructors && instructors.length) {
                        return formatPersonNames(instructors[0].instructor);
                    }
                }
            }
        },
        {
            title: 'Room Parent', cell: (row) => {
                if (row.instructorAssignments) {
                    const instructors = row.instructorAssignments['Room Parent'];
                    if (instructors && instructors.length) {
                        return formatPersonNames(instructors[0].instructor);
                    }
                }
            }
        },
        {
            title: 'Secondary Instructor', cell: (row) => {
                if (row.instructorAssignments) {
                    const instructors = row.instructorAssignments['Secondary Instructor'];
                    if (instructors && instructors.length) {
                        return formatPersonNames(instructors[0].instructor);
                    }
                }
            }
        },
        { title: 'Teaching Assistant', cell: (row) => {
            if (row.instructorAssignments) {
                const instructors = row.instructorAssignments['Teaching Assistant'];
                if (instructors && instructors.length) {
                    return formatPersonNames(instructors[0].instructor);
                }
            }
        } },

    ];

    useEffect(() => {
        const { schoolYearId } = queryString.parse(location.search);

        document.title = 'TOCS - Home';

        RegistrationService.getActiveSchoolClasses(schoolYearId).then(
            (response) => {
                setContent({
                    isLoaded: true,
                    items: response.data
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
    }, []);

    return (
        <Card size="no-max-width">
            <CardTitle>Active School Classes</CardTitle>
            <CardBody>
                <Table header={header} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="id" showAll="true" />
            </CardBody>
        </Card>
    );
};

export default ActiveSchoolClasses;
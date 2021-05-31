import React, { useState, useEffect, useRef, useMemo } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import CheckButton from 'react-validation/build/button';
import Table from '../Table';
import LibrarianService from '../../services/librarian.service';
import { formatPersonNames, bilingualName } from '../../utils/utilities';
import { Card, CardBody, CardTitle } from "../Cards";

import { required } from '../../utils/utilities';

const Books = () => {
    const form = useRef();
    const checkBtn = useRef();
    const [title, setTitle] = useState('');
    const [schoolYearId, setSchoolYearId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [content, setContent] = useState({ error: null, isLoaded: false, items: [] });
    const header = [
        { title: 'Grade', cell: (row) => bilingualName(row.student.studentClassAssignments[0].grade) },
        { title: 'Class', cell: (row) => bilingualName(row.student.studentClassAssignments[0].schoolClass) },
        { title: 'Registration Date', prop: 'lastStatusChangeDate' },
        { title: 'Student Name', cell: (row) => formatPersonNames(row.student) }
    ];

    const fns = useMemo(() => ({
        'startDate': setStartDate,
        'endDate': setEndDate
    }), []);

    const onChangeField = (e) => {
        const { name, value } = e.target;
        fns[name](value);
    };

    const search = (e) => {
        e.preventDefault();
        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            LibrarianService.searchStudents(schoolYearId, startDate, endDate).then(
                (response) => {
                    const books = response.data;
                    books.forEach(book => {
                        if (book.borrower) {
                            const { firstName, lastName, chineseName } = book.borrower;
                            book.borrowerName = formatPersonNames({ firstName, lastName, chineseName })
                        }
                    });
                    setContent({
                        isLoaded: true,
                        items: books
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
        }
    };

    useEffect(() => {
        document.title = 'TOCS - Home';

        LibrarianService.initializeSearchStudents().then(
            (response) => {
                const schoolYear = response.data;
                setTitle(`Search Students By Registration Date For ${schoolYear.name} School Year`);
                setSchoolYearId(schoolYear.id);
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

        setContent({
            isLoaded: true, items: []
        });
    }, []);

    return (
        <Card size="flex">
            <CardTitle>{title}</CardTitle>
            <CardBody>
                <Form ref={form}>
                    <div className="row">
                        <div className="form-group col-md-3 mb-3 text-md-right">
                            <label htmlFor="startDate">Start Date (yyyy-MM-dd)</label>
                        </div>
                        <div className="form-group col-md-2 mb-3">
                            <Input
                                type="text"
                                className="form-control"
                                name="startDate"
                                value={startDate}
                                onChange={onChangeField}
                                validations={[required]}
                            />
                        </div>
                        <div className="form-group col-md-3 mb-3 text-md-right">
                            <label htmlFor="endDate">End Date (yyyy-MM-dd)</label>
                        </div>
                        <div className="form-group col-md-2 mb-3">
                            <Input
                                type="text"
                                className="form-control"
                                name="endDate"
                                value={endDate}
                                onChange={onChangeField}
                                validations={[required]}
                            />
                        </div>
                        <div className="form-group col-md-2 mb-3">
                            <button className="btn btn-primary btn-light" onClick={search}>Search</button>
                        </div>
                    </div>
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>

                <Table header={header} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="id" rowsPerPage="100" />
            </CardBody>
        </Card>
    );
};

export default Books;
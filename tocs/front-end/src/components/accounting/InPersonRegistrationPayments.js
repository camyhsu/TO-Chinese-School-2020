import React, { useState, useEffect } from 'react';
import AccountingService from '../../services/accounting.service';
import { dollar, formatPersonNames, isoToPacific } from '../../utils/utilities';
import Table from '../Table';
import { Card, CardTitle, CardBody } from "../Cards";

const InPersonRegistrationPayments = () => {
    const [content, setContent] = useState({ error: null, isLoaded: false, item: [] });
    const header = [
        { title: 'Requested By', cell: (row) => formatPersonNames(row.paidBy) },
        {
            title: 'Student(s)',
            cell: (row) => row.studentFeePayments.map((studentFeePayment) => formatPersonNames(studentFeePayment.student)).join(',')
        },
        { title: 'Amount', cell: (row) => dollar(row.grandTotalInCents / 100) },
        { title: 'Requested Time', cell: (row) => isoToPacific(row.updatedAt) },
    ];
    useEffect(() => {
        document.title = 'TOCS - Home';

        AccountingService.getInPersonRegistrationPayments().then(
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
            <CardTitle>In-person Registration Payments</CardTitle>
            <CardBody>
                <Table header={header} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="id" showAll="true" />
            </CardBody>
        </Card>
    );
};

export default InPersonRegistrationPayments;
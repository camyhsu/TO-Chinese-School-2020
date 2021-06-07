import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountingService from '../../services/accounting.service';
import { dollar, formatPersonNames, isoToPacific, BiInfoCircle } from '../../utils/utilities';
import Table from '../Table';
import { Card, CardTitle, CardBody } from "../Cards";

const WithdrawRequests = () => {
    const [content, setContent] = useState({ error: null, isLoaded: false, item: [] });
    const header = [
        {
            cell: (row) => <Link to={'/accounting/withdraw-request?id=' + row.id} className='btn btn-light'><BiInfoCircle /></Link>
        },
        { title: 'School Year', cell: (row) => row.schoolYear.name },
        { title: 'Request Date', cell: (row) => isoToPacific(row.createdAt, true) },
        { title: 'Request By', cell: (row) => formatPersonNames(row.requestBy) },
        { title: 'Refund Grand Total', cell: (row) => dollar(row.refundGrandTotalInCents, true) },
        { title: 'Status', prop: 'status' },
    ];
    useEffect(() => {
        document.title = 'TOCS - Home';

        AccountingService.getWithdrawRequests().then(
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
            <CardTitle>Withdraw Requests</CardTitle>
            <CardBody>
                <Table header={header} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="id" showAll="true" />
            </CardBody>
        </Card>
    );
};

export default WithdrawRequests;
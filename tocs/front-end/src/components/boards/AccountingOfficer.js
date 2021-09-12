import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import {
    ListAvtiveSchoolClassGradeClassCount, ListElectiveSchoolClassGradeClassCount, ListWithdrawRequests,
    ListInstructorDiscountInformation, ChargesCollected, DailyRegistrationSummary, ListManualTransactionsFromLastTwoSchoolYears
} from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        document.title = 'TOCS - Home';

        UserService.getAccountingOfficerBoard().then(
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
                <CardTitle>Accounting Officer Resources</CardTitle>
                <div className="row">
                    {content.currentSchoolYear && (
                        <>
                            <div className="col-md-8"><ListAvtiveSchoolClassGradeClassCount schoolYear={content.currentSchoolYear} /></div>
                            <div className="col-md-8"><ListElectiveSchoolClassGradeClassCount schoolYear={content.currentSchoolYear} /></div>
                        </>
                    )}
                    {content.nextSchoolYear && (
                        <>
                            <div className="col-md-8"><ListAvtiveSchoolClassGradeClassCount schoolYear={content.nextSchoolYear} /></div>
                            <div className="col-md-8"><ListElectiveSchoolClassGradeClassCount schoolYear={content.nextSchoolYear} /></div>
                        </>
                    )}
                </div>
                {content.currentAndFutureSchoolYears && content.currentAndFutureSchoolYears.map((schoolYear, sindex) => {
                    return (
                        <React.Fragment key={'schoolYear-' + sindex}>
                            <div className="row">
                                <div className="col-md-12"><DailyRegistrationSummary schoolYear={schoolYear} /></div>
                                <div className="col-md-12"><ChargesCollected schoolYear={schoolYear} /></div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div className="row">
                    <div className="col-md-12"><ListManualTransactionsFromLastTwoSchoolYears /></div>
                </div>
                <div className="row">
                    <div className="col-md-8"><ListInstructorDiscountInformation /></div>
                </div>

                <div className="row">
                    <div className="col-md-8"><ListWithdrawRequests /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
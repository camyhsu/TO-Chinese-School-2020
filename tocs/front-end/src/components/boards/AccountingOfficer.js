import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import { ListInstructorDiscountInformation, ChargesCollected } from '../Links';
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

                setContent(_content);
            }
        );
    }, []);

    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Accounting Officer Resources</CardTitle>
                <div className="row">
                    <div className="col-md-8"><ListInstructorDiscountInformation /></div>
                </div>
                {content.currentAndFutureSchoolYears && content.currentAndFutureSchoolYears.map((schoolYear, sindex) => {
                    return (
                        <React.Fragment key={'schoolYear-' + sindex}>
                            <div className="row">
                                <div className="col-md-12"><ChargesCollected schoolYear={schoolYear} /></div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </CardBody>
        </Card>
    );
};

export default Home;
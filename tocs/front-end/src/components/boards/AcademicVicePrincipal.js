import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import {
    ViewLibraryBooks, ListActiveSchoolClasses,
    ListAvtiveSchoolClassGradeClassCount, ListElectiveSchoolClassGradeClassCount,
} from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        document.title = 'TOCS - Home';

        UserService.getAcademicVicePrincipalBoard().then(
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
                <CardTitle>Academic Vice Principal Resources</CardTitle>
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
                <div className="row">
                    <div className="col-md-6"><ListActiveSchoolClasses /></div>
                    <div className="col-md-6"><ViewLibraryBooks /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
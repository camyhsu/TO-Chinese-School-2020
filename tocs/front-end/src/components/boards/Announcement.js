import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import UserService from "../../services/user.service";
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    const [content, setContent] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        document.title = 'TOCS - Home';

        UserService.getAnnouncements().then(
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
    }, [dispatch]);

    const { children, activeSchoolYears } = content;

    return (children && children.length > 0 && activeSchoolYears.map((schoolYear, index) => {
        return (
            <React.Fragment key={'sy-' + index}>
                <Card size="medium" plain="true">
                    <CardBody>
                        <CardTitle>Register For {schoolYear.name} School Year</CardTitle>
                        <p className="text-danger">Please confirm your children's Chinese and English names.<br />These will be used as-is in yearbook.</p>
                        <Link to={`/student-registration?schoolYearId=${schoolYear.id}`} className="btn btn-dark">Start</Link>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    })) || null;
};
export default Home;
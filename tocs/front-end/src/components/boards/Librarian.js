import { ManageBooks, ListActiveSchoolClasses, SearchStudentsByRegistrationDates } from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Librarian Resources</CardTitle>
                <div className="row">
                    <div className="col-md-6"><ListActiveSchoolClasses /></div>
                    <div className="col-md-6"><ManageBooks /></div>
                </div>
                <div className="row">
                    <div className="col-md-12"><SearchStudentsByRegistrationDates /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
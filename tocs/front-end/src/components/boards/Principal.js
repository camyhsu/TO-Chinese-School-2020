import { ManageStaffAssignments, ViewLibraryBooks, ListActiveSchoolClasses } from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Principal Resources</CardTitle>
                <div className="row">
                    <div className="col-md-6"><ViewLibraryBooks /></div>
                    <div className="col-md-6"><ManageStaffAssignments /></div>
                    <div className="col-md-6"><ListActiveSchoolClasses /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
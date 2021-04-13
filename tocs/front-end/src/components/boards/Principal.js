import { ManageStaffAssignments, ViewLibraryBooks } from '../Links';
import { Card, CardBody } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <h4 className="card-title">Principal Resources</h4>
                <div className="row">
                    <div className="col-md-6"><ViewLibraryBooks /></div>
                    <div className="col-md-6"><ManageStaffAssignments /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
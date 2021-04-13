import { ListAllGrades, ManageSchoolYears } from '../Links';
import { Card, CardBody } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <h4 className="card-title">Registration Officer Resources</h4>
                <div className="row">
                    <div className="col-md-6"><ListAllGrades /></div>
                    <div className="col-md-6"><ManageSchoolYears /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
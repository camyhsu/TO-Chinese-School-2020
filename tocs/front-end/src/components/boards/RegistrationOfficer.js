import { ListAllGrades, ListAllSchoolClasses, ManageSchoolYears, CreateANewFamily, ListAllPeople } from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Registration Officer Resources</CardTitle>
                <div className="row">
                    <div className="col-md-6"><ListAllGrades /></div>
                    <div className="col-md-6"><ListAllSchoolClasses /></div>
                    <div className="col-md-6"><ManageSchoolYears /></div>
                    <div className="col-md-6"><CreateANewFamily /></div>
                    <div className="col-md-6"><ListAllPeople /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
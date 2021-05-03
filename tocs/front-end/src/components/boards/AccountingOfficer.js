import { ListInstructorDiscountInformation } from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Accounting Officer Resources</CardTitle>
                <div className="row">
                    <div className="col-md-8"><ListInstructorDiscountInformation /></div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
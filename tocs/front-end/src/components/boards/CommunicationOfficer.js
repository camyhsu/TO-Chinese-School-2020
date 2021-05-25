import { Card, CardBody, CardTitle } from "../Cards";
import { CSV } from '../Links';

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Communication Officer Resources</CardTitle>
                <div className="row">
                    <div className="col-md-12">
                        <CSV path="communication/forms/student_list_for_yearbook" text="Download Student List For Yearbook CSV" />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default Home;
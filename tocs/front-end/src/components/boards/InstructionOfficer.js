import { ViewLibraryBooks } from '../Links';
import { Card, CardBody } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <h4 className="card-title">Instruction Officer Resources</h4>
                <ViewLibraryBooks/>
            </CardBody>
        </Card>
    );
};

export default Home;
import { ManageBooks } from '../Links';
import { Card, CardBody } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <h4 className="card-title">Librarian Resources</h4>
                <ManageBooks/>
            </CardBody>
        </Card>
    );
};

export default Home;
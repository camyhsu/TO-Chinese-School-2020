import { ManageBooks } from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Librarian Resources</CardTitle>
                <ManageBooks/>
            </CardBody>
        </Card>
    );
};

export default Home;
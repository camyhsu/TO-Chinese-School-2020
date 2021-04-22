import { ViewLibraryBooks } from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Instruction Officer Resources</CardTitle>
                <ViewLibraryBooks/>
            </CardBody>
        </Card>
    );
};

export default Home;
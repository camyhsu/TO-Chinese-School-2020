import { ViewLibraryBooks } from '../Links';
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
    return (
        <Card size="medium" plain="true">
            <CardBody>
                <CardTitle>Academic Vice Principal Resources</CardTitle>
                <ViewLibraryBooks/>
            </CardBody>
        </Card>
    );
};

export default Home;
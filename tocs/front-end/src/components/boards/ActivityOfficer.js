import { ListActiveSchoolClasses } from "../Links";
import { Card, CardBody, CardTitle } from "../Cards";

const Home = () => {
  return (
    <Card size="medium" plain="true">
      <CardBody>
        <CardTitle>Activity Officer Resources</CardTitle>
        <div className="row">
          <div className="col-md-6">
            <ListActiveSchoolClasses />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Home;

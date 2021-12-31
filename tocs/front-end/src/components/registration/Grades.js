import React, { useState, useEffect } from "react";
import Table from "../Table";
import RegistrationService from "../../services/registration.service";
import { Card, CardBody } from "../Cards";

const Home = () => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    items: [],
  });
  const header = [
    { title: "Chinese Name", prop: "chineseName" },
    { title: "English Name", prop: "englishName" },
    { title: "Short Name", prop: "shortName" },
  ];

  useEffect(() => {
    document.title = "TOCS - Home";

    RegistrationService.getGrades().then(
      (response) => {
        const grades = response.data;
        setContent({
          isLoaded: true,
          items: grades,
        });
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent({
          isLoaded: true,
          error: { message: _content },
        });
      }
    );
  }, []);

  return (
    <Card size="medium">
      <CardBody>
        <Table
          header={header}
          items={content.items}
          isLoaded={content.isLoaded}
          error={content.error}
          sortKey="id"
          showAll="true"
        />
      </CardBody>
    </Card>
  );
};

export default Home;

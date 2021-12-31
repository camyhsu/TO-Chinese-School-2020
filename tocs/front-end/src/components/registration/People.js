import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Table from "../Table";
import RegistrationService from "../../services/registration.service";
import { Card, CardBody } from "../Cards";
import {
  formatPersonName,
  pagingDataToContent,
  BiInfoCircle,
} from "../../utils/utilities";

const People = () => {
  const [content, setContent] = useState({
    error: null,
    isLoaded: false,
    items: [],
    maxPage: 1,
  });
  const [filter, setFilter] = useState("");
  const [sortedProp, setSortedProp] = useState({
    prop: "chineseName",
    isAscending: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const header = [
    {
      cell: (row) => (
        <Link
          to={"/registration/show-person?id=" + row.id}
          className="btn btn-light"
        >
          <BiInfoCircle />
        </Link>
      ),
    },
    { title: "Chinese Name", prop: "chineseName", sortable: true },
    { title: "English Name", cell: (row) => formatPersonName(row) },
    { title: "Gender", prop: "gender" },
    { title: "Birth Year", prop: "birthYear" },
    { title: "Birth Month", prop: "birthMonth" },
    { title: "Native Language", prop: "nativeLanguage" },
  ];

  const onFilter = useCallback((text) => {
    setFilter(text);
  }, []);

  const onSort = useCallback((nextProp) => {
    setSortedProp((oldState) => {
      const nextSort = { ...oldState };

      if (nextProp !== oldState.prop) {
        nextSort.prop = nextProp;
        nextSort.isAscending = true;
      } else {
        nextSort.isAscending = !oldState.isAscending;
      }

      return nextSort;
    });
  }, []);

  const onPageNavigate = useCallback((nextPage) => {
    setCurrentPage(nextPage);
  }, []);

  useEffect(() => {
    document.title = "TOCS - Home";

    RegistrationService.getPeople(
      currentPage,
      rowsPerPage,
      filter,
      sortedProp
    ).then(
      (response) => {
        setContent(pagingDataToContent(response, rowsPerPage));
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
  }, [currentPage, rowsPerPage, filter, sortedProp]);

  return (
    <Card size="xlarge">
      <CardBody>
        <Table
          header={header}
          items={content.items}
          isLoaded={content.isLoaded}
          error={content.error}
          sortKey="chineseName"
          async={{
            currentPage,
            filterText: filter,
            maxPage: content.maxPage,
            onFilter,
            onSort,
            onPaginate: onPageNavigate,
            rowsPerPage,
            sortedProp: { prop: "chineseName", isAscending: true },
          }}
        />
      </CardBody>
    </Card>
  );
};

export default People;

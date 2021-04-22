import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Table from '../Table';
import LibrarianService from '../../services/librarian.service';
import { formatPersonNames, BiPlus, BiPencil, BiClockHistory } from '../../utils/utilities';
import { Card, CardBody } from "../Cards";

const Books = ({ location } = {}) => {
  const [content, setContent] = useState({ error: null, isLoaded: false, items: [] });
  const header = [
    { title: 'Book Id', prop: 'id', sortable: true, filterable: true },
    { title: 'Title', prop: 'title', sortable: true, filterable: true },
    { title: 'Description', prop: 'description', sortable: true, filterable: true },
    { title: 'Publisher', prop: 'publisher', sortable: true, filterable: true },
    { title: 'Book Type', prop: 'bookType', sortable: true, filterable: true },
    { title: 'Checked Out By', prop: 'borrowerName', sortable: true, filterable: true },
    { title: 'Note', prop: 'note', sortable: true, filterable: true }
  ];

  const allHeaders = [
    {
      cell: (row) => <Link to={'/book-form?id=' + row.id} className='btn btn-light'><BiPencil/></Link>
    }, {
      cell: (row) => <Link to={'/librarian/checkout-history?id=' + row.id} className='btn btn-light'><BiClockHistory/></Link>
    }].concat(header);

  const [readOnly, setReadOnly] = useState('');

  useEffect(() => {
    document.title = 'TOCS - Home';
    const { params } = location;
    if (params && params.readOnly) {
      setReadOnly(true);
    }

    LibrarianService.getLibraryBooks().then(
      (response) => {
        const books = response.data;
        books.forEach(book => {
          if (book.borrower) {
            const { firstName, lastName, chineseName } = book.borrower;
            book.borrowerName = formatPersonNames({ firstName, lastName, chineseName })
          }
        });
        setContent({
          isLoaded: true,
          items: books
        });
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent({
          isLoaded: true,
          error: { message: _content }
        });
      }
    );
  }, [location]);

  return (
    <Card size="flex">
        <CardBody>
          <div className="row">
            <div className="col-md-3">
              {!readOnly && <Link to="/book-form" className="btn btn-light"><BiPlus/> Book</Link>}
            </div>
          </div>
          <Table header={readOnly ? header : allHeaders} items={content.items} isLoaded={content.isLoaded} error={content.error} sortKey="id" />
        </CardBody>
    </Card>
  );
};

export default Books;
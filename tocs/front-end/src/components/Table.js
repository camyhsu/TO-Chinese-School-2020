import Datatable from "react-bs-datatable";
import { css } from '@emotion/css'

const Table = ({ header, items, isLoaded, error, keyName, sortKey, showAll }) => {
    const customLabels = {
        first: '<<',
        last: '>>',
        prev: '<',
        next: '>',
        show: 'Display',
        entries: 'rows',
        noResults: 'There is no data to be displayed'
    };

    const classes = {
        table: 'table-striped',
        theadCol: css`white-space: nowrap;`,
        tbodyRow: css`
          &:nth-of-type(even) {
            background: #EAEAEA;
          }
        `,
        paginationOptsFormText: css`
          &:first-of-type {
            margin-right: 8px;
          }
          &:last-of-type {
            margin-left: 8px;
          }
        `
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        const optional = {
          rowsPerPage: 10
        };
        if (showAll === 'true') {
          delete optional.rowsPerPage;
        }

        return (
            <div className="table-responsive">
                <Datatable
                    tableHeaders={header}
                    tableBody={items}
                    keyName={keyName}
                    labels={customLabels}
                    classes={classes}
                    {...optional}
                    initialSort={{ prop: sortKey, isAscending: true }}
                />
            </div>
        );
    }
};

export default Table;
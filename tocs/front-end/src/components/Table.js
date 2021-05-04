import Datatable from "react-bs-datatable";
import { css } from '@emotion/css'

const Table = ({ header, items, isLoaded, error, keyName, sortKey, showAll, wrapHeader, wrapCell, rowsPerPage, async }) => {
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
        theadCol: !wrapHeader && css`white-space: nowrap;`,
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
        `,
        tbodyCol: !wrapCell && css`white-space: nowrap;`,
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        const optional = {
          rowsPerPage: rowsPerPage || 10
        };
        if (showAll === 'true') {
          delete optional.rowsPerPage;
        }
        if (async) {
          optional.async = async;
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
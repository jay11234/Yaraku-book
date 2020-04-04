import React from 'react'
import { CSVLink } from 'react-csv'
import {Button} from 'reactstrap';

export const ExportReactCSV = ({csvData, fileName}) => {
    return (
        <Button color="warning" style={{marginLeft :10}}>
            <CSVLink   data={csvData} filename={fileName}>Export CSV</CSVLink>
        </Button>
    )
}
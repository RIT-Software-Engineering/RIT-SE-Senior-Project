import React, { useState, useEffect, useContext } from 'react';
import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Icon,
} from "semantic-ui-react";
import { SecureFetch } from '../util/secureFetch';
import { config } from '../util/constants';
import SponsorEditor from "./SponsorEditor";

const LOGS_PER_PAGE = 4;

export default function SponsorsTab(props) {

    const [sponsors, setSponsors] = useState([]);
    const [sponsorsCount, setSponsorsCount] = useState(LOGS_PER_PAGE);
    const [activePages, setActivePages] = React.useReducer();
    let activePage = 0;
    let summaryView = props?.notSummaryView ? "" : "summaryView";

    const getPaginationData = () => {
        SecureFetch(`${config.url.API_GET_ALL_SPONSORS}/?resultLimit=${LOGS_PER_PAGE}&offset=${LOGS_PER_PAGE * activePage}`)
            .then((response) => response.json())
            .then((sponsors) => {
                setSponsors(sponsors.sponsors);
                setSponsorsCount(sponsors.sponsorsCount);
            })
            .catch((error) => {
                alert("Failed to get sponsors data " + error);
            });
    }

    useEffect(() => {
        getPaginationData();
    }, [])
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Company</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Phone</TableHeaderCell>
                        <TableHeaderCell>Association</TableHeaderCell>
                        <TableHeaderCell>Type</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>View</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sponsors?.map((sponsor, idx) => {
                        let name = `${sponsor.fname} ${sponsor.lname}`;
                        let compAndDiv = `${sponsor.company} `
                        if(sponsor.division !== null){
                            compAndDiv += ("("+ sponsor?.division + ")")
                        }
                        return (
                            <TableRow key={idx}>
                                <TableCell>{name}</TableCell>
                                <TableCell>{compAndDiv}</TableCell>
                                <TableCell>{sponsor.email}</TableCell>
                                <TableCell>{sponsor.phone}</TableCell>
                                <TableCell>{sponsor.association}</TableCell>
                                <TableCell>{sponsor.type}</TableCell>
                                <TableCell>{sponsor.status}</TableCell>
                                <TableCell>
                                    <SponsorEditor summaryView={summaryView} sponsor={sponsor} callback={getPaginationData}/>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="pagination-container">
                <Pagination
                    defaultActivePage={1}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    totalPages={Math.ceil(sponsorsCount / LOGS_PER_PAGE)}
                    onPageChange={(event, data) => {
                        activePage = data.activePage - 1;
                    }}
                />
            </div>
        </>
    )
}

import _ from "lodash";
import React, {useState, useEffect} from 'react';
//useReducer
import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Icon, Input,
} from "semantic-ui-react";
import { SecureFetch } from '../util/secureFetch';
import { config } from '../util/constants';
import SponsorEditor from "./SponsorEditor";

const LOGS_PER_PAGE = 4;

export default function SponsorsTab(props) {

    const [sponsors, setSponsors] = useState([]);
    const [sponsorsCount, setSponsorsCount] = useState(LOGS_PER_PAGE);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);


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

    // let handleResultSelect = (e, { result }) => this.setState({ value: result.title })
    function formatResults(results){
        let formattedResults = []
        for (const result of results){
            formattedResults.push({
                title: (result.fname + result.lname)
            })
        }
        return formattedResults
    }

    let handleSearchChange = (e, { value }) => {
        setIsSearchLoading(true);
        setSearchBarValue(value);

        SecureFetch(`${config.url.API_GET_SEARCH_FOR_SPONSOR}/?resultLimit=${LOGS_PER_PAGE}&offset=${LOGS_PER_PAGE * activePage}&searchQuery=${value}`)
            .then((response) => response.json())
            .then((results) => {
                setSearchResults(formatResults(results.sponsors))
                setIsSearchLoading(false);
                setSponsorsCount(results.sponsorsCount);
                activePage = 1
                setSponsors(results.sponsors);
            })
            .catch((error) => {
                alert("An issue occurred while searching for sponsor content " + error);
            });
    }

    useEffect(() => {
        getPaginationData();
    }, [])
    return (
        <>
            <Input
                icon='search'
                iconPosition='left'
                placeholder='Search...'
                value={searchBarValue}
                onChange={_.debounce(handleSearchChange, 500, {
                    leading: true,
                })}
            />
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
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    activePage={activePage}
                    totalPages={Math.ceil(sponsorsCount / LOGS_PER_PAGE)}
                    onPageChange={(event, data) => {
                        activePage = data.activePage - 1;
                        getPaginationData()
                    }}
                />
            </div>
        </>
    )
}

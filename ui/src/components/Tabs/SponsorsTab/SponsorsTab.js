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
    Icon, Input, Button,
} from "semantic-ui-react";
import { SecureFetch } from '../../util/functions/secureFetch';
import { config } from '../../util/functions/constants';
import SponsorEditor from "./SponsorEditor";
import { formatPhoneNumber } from 'react-phone-number-input/input'
import { CSVDownload } from 'react-csv';

const LOGS_PER_PAGE = 2;

export default function SponsorsTab(props) {

    const [sponsors, setSponsors] = useState([]);
    const [sponsorsCount, setSponsorsCount] = useState(LOGS_PER_PAGE);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [sponsorData, setSponsorData] = useState([]);

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



    const getSponsorData = (event, done) => {
        SecureFetch(`${config.url.API_GET_SPONSOR_DATA}`)
            .then((response) => response.json())
            .then((sponsorDataJson) => {
                setSponsorData(sponsorDataJson);
            })
            .catch((error) => {
                alert("Failed to get Sponsor Data for csv " + error);
            })

    }


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
            {/*This is a button that is only displayed in the admin tab sponsors. supposed to return a csv of all the data returned by sponsor*/}
            {props.notSummaryView &&
                <>
                    <Button content={"Sponsor Info"} onClick={getSponsorData} primary={true} style={{float: 'right'}} color="primary" className="float-right" />
                    {sponsorData.length !== 0 &&

                        <CSVDownload
                            data={sponsorData}
                            filename={'sponsor-data.csv'}
                            target="_self"
                        />
                    }
                </>


            }
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
                        if(sponsor.division !== null && sponsor.division !== ''){
                            compAndDiv += ("("+ sponsor?.division + ")")
                        }
                        let status = ''
                        if(sponsor.inActive === 1){
                            status += "InActive ";
                        }
                        if(sponsor.doNotEmail === 1){
                            status += "Do Not Email "
                        }
                        return (
                            <TableRow key={idx}>
                                <TableCell>{name}</TableCell>
                                <TableCell>{compAndDiv}</TableCell>
                                <TableCell>{sponsor.email}</TableCell>
                                <TableCell>{formatPhoneNumber(sponsor.phone)}</TableCell>
                                <TableCell>{sponsor.association}</TableCell>
                                <TableCell>{sponsor.type}</TableCell>
                                <TableCell>{status}</TableCell>
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

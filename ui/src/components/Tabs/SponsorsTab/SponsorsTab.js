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

const LOGS_PER_PAGE = 20;

export default function SponsorsTab(props) {

    const [sponsors, setSponsors] = useState([]);
    const [sponsorsCount, setSponsorsCount] = useState(LOGS_PER_PAGE);
    const [searchBarValue, setSearchBarValue] = useState("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [sponsorData, setSponsorData] = useState([]);
    const [activePage, setActivePage] = useState(0)
    const [pageChange, setPageChange] = useState(0)
    const [pageNumBeforeSearch, setPageNumBeforeSearch] = useState(0)

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

    /**
     * getSponsorData is used for building the csv with sponsor info.
     **/

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
        //If this is the first letter entered to value, keep track that a search is being made.
        if(pageNumBeforeSearch === 0){
            setPageNumBeforeSearch(activePage + 1);
        }
        //If the search value is empty, don't do a search for projects, and return back to the page originally on.
        if(value === ""){
            setActivePage(pageNumBeforeSearch - 1);
            setPageNumBeforeSearch(0);
            setPageChange(pageChange + 99);
        }
        SecureFetch(`${config.url.API_GET_SEARCH_FOR_SPONSOR}/?resultLimit=${LOGS_PER_PAGE}&offset=${0}&searchQuery=${value}`)
            .then((response) => response.json())
            .then((results) => {
                setSearchResults(formatResults(results.sponsors))
                setIsSearchLoading(false);
                setSponsorsCount(results.sponsorsCount);
                setSponsors(results.sponsors);
            })
            .catch((error) => {
                alert("An issue occurred while searching for sponsor content " + error);
            });
    }

    useEffect(() => {
        getPaginationData();
    }, [pageChange])


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
                    <Button content={"Sponsor Csv"} onClick={getSponsorData} primary={true} style={{float: 'right'}} color="primary" className="float-right" />
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
                    activePage={activePage + 1}
                    totalPages={Math.ceil(sponsorsCount / LOGS_PER_PAGE)}
                    onPageChange={(event, data) => {
                        setActivePage(data.activePage - 1);
                        setPageChange(data.activePage - 1)
                    }}
                />
            </div>
        </>
    )
}

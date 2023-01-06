import React, { useState, useEffect } from "react";
import {
    Icon,
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow
} from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";
import _ from "lodash";
import ArchivePanel from "./ArchivePanel";

const projectsPerPage = 10

export default function ArchiveTable() {

    const [projects, setProjects] = useState([])
    const [projectCount, setProjectCount] = useState(projectsPerPage)
    const [activePage, setActivePage] = useState(0)
    const [pageChange, setPageChange] = useState(0)
    const [searchBarValue, setSearchBarValue] = useState("")
    const [pageNumBeforeSearch, setPageNumBeforeSearch] = useState(0)

    const getPaginationData = () => {
        SecureFetch(
            `${config.url.API_GET_EXEMPLARY_PROJECTS}?resultLimit=${projectsPerPage}&offset=${projectsPerPage * activePage}&featured=false`
        )
            .then((response) => {
                if (response.ok) {
                    console.log("?");
                    return response.json();
                } else {
                    throw response;
                }
            })
            .then((data) => {
                setProjects(data.projects)
                setProjectCount(data.totalProjects)
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getPaginationData();
    }, [pageChange]);

    //Search feature functionality
    let handleSearchChange = (e, {value}) => {
        // Input handling
        const input = value.replace(/[^a-zA-Z\d\s\-]/g, "");
        console.log(input);
        setSearchBarValue(input);
        if (input.length === 0) return;
        // If this is the first letter entered to value, keep track that a search is being made.
        if (pageNumBeforeSearch === 0) {
            setPageNumBeforeSearch(activePage + 1);
        }
        // If the search value is empty, don't do a search for projects, and return to the page originally on.
        if (input === "") {
            console.log("im entering ")
            setActivePage(pageNumBeforeSearch - 1);
            setPageNumBeforeSearch(0);
            setPageChange(pageChange + 99);
            return;
        }
        SecureFetch(`${config.url.API_GET_SEARCH_FOR_PROJECTS}/?resultLimit=${projectsPerPage}&offset=${0}&searchQuery=${input}`)
            .then((response) => response.json())
            .then((results) => {
                setProjectCount(results.projectCount);
                setProjects(results.projects);
            })
            .catch((error) => {
                alert("An issue occurred while searching for archive content " + error);
            });
    }

    const table = () => {
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
                            <TableHeaderCell>
                                Title
                            </TableHeaderCell>
                            <TableHeaderCell>
                                Members
                            </TableHeaderCell>
                            <TableHeaderCell>
                                Sponsor
                            </TableHeaderCell>
                            <TableHeaderCell>
                                Tags
                            </TableHeaderCell>
                            <TableHeaderCell>
                                Edit
                            </TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{projects?.map((project, idx) => {
                        let title = `${project.title}`
                        let members = `${project.members}`
                        let sponsor = `${project.sponsor}`
                        let tags = [project.featured ? 'featured' : null, project.creative ? 'creative' : null, project.outstanding ? 'outstanding' : null]
                        return (
                            <TableRow key={idx}>
                                <TableCell>{title}</TableCell>
                                <TableCell>{members}</TableCell>
                                <TableCell>{sponsor}</TableCell>
                                <TableCell>{tags.filter(Boolean).join(", ")}</TableCell>
                                <TableCell>
                                    <ArchivePanel
                                        project={project}
                                        header={"Edit Archive"}
                                        buttonIcon={"edit"}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    })}</TableBody>
                </Table>
                <div className="pagination-container">
                    <Pagination
                        activePage={activePage + 1}
                        ellipsisItem={null}
                        firstItem={null}
                        lastItem={null}
                        prevItem={{content: <Icon name="angle left"/>, icon: true}}
                        nextItem={{content: <Icon name="angle right"/>, icon: true}}
                        totalPages={Math.ceil(projectCount / projectsPerPage)}
                        onPageChange={(event, data) => {
                            setActivePage(data.activePage - 1);
                            setPageChange(data.activePage - 1);
                        }}
                    />
                </div>
            </>
        );
    }

    return (
        table()
    );
}

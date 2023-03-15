import React, { useEffect, useState } from "react";
import { Accordion } from "semantic-ui-react";
import { config } from "../../../util/functions/constants";
import { SecureFetch } from "../../../util/functions/secureFetch";
import ArchivePanel from "./ArchivePanel";
import ArchiveTable from "./ArchiveTable";

const projectsPerPage = 10

export default function ArchiveEditor() {
    const [projects, setProjects] = useState([]);
    const [projectCount, setProjectCount] = useState(projectsPerPage)
    const [activePage, setActivePage] = useState(0)

    useEffect(() => {
        SecureFetch(
            `${config.url.API_GET_ARCHIVES}?resultLimit=${projectsPerPage}&offset=${activePage}`
        )
            .then((response) => {
                if (response.ok) {
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
    }, []);

    let archivesToEdit = <ArchiveTable projects={projects} archiveData={projects}/>;

    return (
        <div className="accordion-button-group">
            <Accordion
                fluid
                styled
                panels={[
                    {
                        key: "archiveEditor",
                        title: "Archive Editor",
                        content: { content: archivesToEdit },
                    },
                ]}
            />
            <div className="accordion-buttons-container">
                <ArchivePanel
                    project={"null"}
                    create={true}
                    newArchive
                    header={"Create Archive"}
                />
            </div>
        </div>
    );
}

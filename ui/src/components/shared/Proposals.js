import React, { useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react';

export default function Proposals() {

    const [proposals, setProposals] = useState([])

    useEffect(() => {
        fetch("http://localhost:3001/db/getProposalPdfNames")
            .then((response) => response.json())
            .then((proposalTitles) => {
                setProposals(proposalTitles.map((proposalTitle) => {
                    return {
                        title: proposalTitle,
                        attachments: [],
                    }
                }))
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            })

        // TODO: Finish implementing this and remove above fetch to just getProposalPdfNames.
        // Get all proposal data in one call instead of getting proposals and then doing a separate call for each proposal to get it's attachments
        // TODO: Alternatively, the UI can be changed so that a user needs to click on something to get the attachments and then the attachments will be fetched then.
        fetch("http://localhost:3001/db/getProposals")
            .then((response) => response.json())
            .then((proposals) => {
                console.log("proposals", proposals);
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            })
    }, []);

    if(!proposals.length) {
        return <Icon name="spinner"/>
    }

    return (
        <table>
            <tbody>
                {proposals.map((proposal, idx) => {
                    return(
                        <tr key={idx}>
                            <td>
                                <a href={`http://localhost:3001/db/getProposalPdf?name=${proposal.title}`} target="_blank" rel="noreferrer">
                                    {proposal.title}
                                </a>
                            </td>
                            <td>
                                {proposal.proposalAttachments?.map((attachment, idx) => {
                                    return (<a href={`/db/getProposalAttachment?proposalTitle=${proposal.title}&name=${attachment}`} target="_blank" rel="noreferrer" key={idx}>
                                                {attachment}
                                            </a>
                                )})}
                            </td>
                        </tr>
                    ) 
                })}
            </tbody>
        </table>
    )
}

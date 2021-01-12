import React, { useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react';

export default function Proposals() {

    const [proposals, setProposals] = useState();

    useEffect(() => {

        // TODO: Do pagination
        fetch("http://localhost:3001/db/getProposals")
            .then((response) => response.json())
            .then((proposals) => {
                setProposals(proposals)
            })
            .catch((error) => {
                alert("Failed to get proposal data " + error);
            })
    }, []);

    const renderProposals = () => {
        if(proposals.length === 0) {
            return <tr><td>No proposals</td></tr>;
        }

        return proposals.map((proposal, idx) => {
            return(
                <tr key={idx}>
                    <td>
                        <a href={`http://localhost:3001/db/getProposalPdf?name=${proposal.title}.pdf`} target="_blank" rel="noreferrer">
                            {proposal.title}
                        </a>
                    </td>
                    <td>
                        {proposal.attachments?.split(', ').map((attachment, idx) => {
                            return (<a href={`/db/getProposalAttachment?proposalTitle=${proposal.title}&name=${attachment}`} target="_blank" rel="noreferrer" key={idx}>
                                        {attachment}
                                    </a>
                        )})}
                    </td>
                </tr>
            ) 
        })
    }

    if(!proposals) {
        return <Icon name="spinner"/>
    }

    return (
        <table>
            <tbody>
                {renderProposals()}
            </tbody>
        </table>
    )
}

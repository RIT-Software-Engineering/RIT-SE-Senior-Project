import React, { useEffect, useState } from 'react'
import { Icon } from 'semantic-ui-react';

export default function Proposals() {

    const [proposals, setProposals] = useState([])

    useEffect(() => {
        fetch("http://localhost:3001/db/getProposalPdfNames")
            .then((response) => response.json())
            .then((proposalData) => {
                setProposals(proposalData);
            })
            .catch((error) => {
                alert("Failed to get proposal data" + error);
            })
    }, []);

    return (
        <table>
            {!proposals && <Icon name="spinner"/>}
            {proposals.map((proposal) => {
                return(
                    <>
                        <a href={`http://localhost:3001/db/getProposalPdf?name=${proposal}`} target="_blank" rel="noreferrer">
                            {proposal}
                        </a><br/>
                    </>
                ) 
            })}
        </table>
    )
}

import SponsorEditor from "../SponsorsTab/SponsorEditor";
import SponsorsTab from "../SponsorsTab/SponsorsTab";
import {Accordion} from "semantic-ui-react";
import React from "react";

export default function SponsorEditorAccordion(){
    return (
        <div className="accordion-button-group">
            <Accordion
                fluid
                styled
                panels={[
                    {
                        key: "sponsorEditor",
                        title: "Sponsors",
                        content: { content: <SponsorsTab notSummaryView /> },
                    },
                ]}
            />
            <div className="accordion-buttons-container">
                <SponsorEditor />
            </div>
        </div>
    );
}
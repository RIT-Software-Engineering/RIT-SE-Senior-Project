import React, { useState } from "react";
import { Accordion } from "semantic-ui-react";
import _ from "lodash";
import SubmissionsTable from "./SubmissionsTable";
  
export default function ActionSubmissions(props) {
      const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(prev => !prev);
    };

    const getActionTarget = (target) => {
        switch(target) {
            case "individual":
                return "Individual";
             case "coach":
                return "Coach";
            case "team":
                return "Team";
            case "admin":
                return "Admin";
            case "peer_evaluation":
                return "Peer Evaluation";
            case "break_period":
                return "Break Period";
            default:
                return target;
        }
    }
  
    return (
        <>
            <div className="accordion-button-group">
                <Accordion
                key={"ACTION"}
                fluid
                styled
                onTitleClick={toggleAccordion}
                panels={[
                    {
                    key: "Action",
                    title: `${props.actionTitle} (${getActionTarget(props.target)})`,
                    content: {
                        content:
                        <>
                            {isOpen && 
                                (<SubmissionsTable
                                semesterMap={props.semesterMap}
                                prevLogin={props.prevLogin}
                                userContext={props.userContext}
                                projects={props.projects}
                                target={props.target}
                                action={props.action}
                                isOpenCallback={props.isOpenCallback}
                            />)}
                        </>
                    }
                    }
                ]}
                />
            </div>
        </>
    );
}
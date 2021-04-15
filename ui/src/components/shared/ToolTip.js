import React, { useState } from "react";
import { Popup } from "semantic-ui-react";
import ActionModal from "./ActionModal";

function ToolTip(props) {
    const [closeOnDocClick, setCloseOnDocClick] = useState(true);

    let isOpenCallback = function (isOpen) {
        setCloseOnDocClick(!isOpen);
    };

    return false/*(
        <Popup
            header={props.action.action_title}
            content={
                <div className="content">
                    <p dangerouslySetInnerHTML={{ __html: props.action.short_desc }} />
                    <p>Starts: {props.action.start_date}</p>
                    <p>Due: {props.action.due_date}</p>
                    <ActionModal key={props.action.action_id} {...props.action} isOpenCallback={isOpenCallback} />
                </div>
            }
            closeOnDocumentClick={closeOnDocClick}
            style={{ zIndex: 100 }}
            trigger={props.trigger}
            on="click"
        />
    )*/;
}

export default ToolTip;

import React from 'react'
import ActionElements from './ActionElements';
import { ACTION_STATES } from '../../../../util/functions/constants';
import _ from "lodash";

export default function UpcomingActions(props) {

    let filteredActions = props.actions?.filter(action => {
        return [ACTION_STATES.YELLOW, ACTION_STATES.RED].includes(action.state)
    }) || [];


    if (filteredActions.length < 3) {
        let allSortedActions = _.sortBy(props.actions, ["due_date", "start_date", "action_title"]);
        let count = filteredActions.length;
        filteredActions = filteredActions.concat(allSortedActions?.filter(action => {
            if (count < 3 && action.state === ACTION_STATES.GREY) {
                count++;
                return true;
            }
            return false;
        }));
    }

    return (
        <ActionElements
            autoLoadSubmissions
            noPopup
            actions={filteredActions}
            projectId={props.projectId}
            projectName={props.projectName}
            semesterName={props.semesterName}
            reloadTimelineActions={props.reloadTimelineActions}
        />
    )
}

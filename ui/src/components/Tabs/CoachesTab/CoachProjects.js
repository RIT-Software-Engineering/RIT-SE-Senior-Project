import React, { useEffect, useState } from "react";
import { 
    Accordion,
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
 } from "semantic-ui-react";
 import { config } from "../../util/functions/constants";
 import { SecureFetch } from "../../util/functions/secureFetch";


export default function OverdueCoachActions({project}) {
    const [actionInfo, setActionInfo] = useState([]);
    
    useEffect(() => {
        SecureFetch(`${config.url.API_GET_TIMELINE_ACTIONS}?project_id=${project.project_id}`)
        .then((response) => response.json())
        .then((actionInfo) =>{
            setActionInfo(actionInfo);
            console.log(actionInfo)
        })
        .catch((error) => {
            alert("Failed to get actionInfo data" + error);
        });
    }, []);
    
    return (
        
        <TableBody>
            {actionInfo?.filter(
                (action) =>
                action.state === "red" && 
                action.action_target === "coach"
            )
            ?.map((action) => {
                return(
                    <TableRow key={action.action_id}>
                        <TableCell> {project.title} </TableCell>
                        <TableCell> {action.action_title} </TableCell>
                        <TableCell> {action.due_date} </TableCell>
                    </TableRow>
                );
            })}
        </TableBody>
    )

}

import React, { useState } from 'react'

import {Button, Divider, Icon, Modal, ModalActions} from 'semantic-ui-react';
import {formatDate} from "../../util/functions/utils";
import {SecureFetch} from "../../util/functions/secureFetch";


export default function IndividualTimeModal(props) {

    const [open, setOpen] = useState(false);
    const [submission, setSubmission] = useState({});
    const [files, setFiles] = useState([]);
    const [noSubmission, setNoSubmission] = useState(true)
    const [due, setDue] = useState()
    const [late, setLate] = useState(false);
    const [day, setDay] = useState(0)
    const handleDelete = async function (e) {
        let body = new FormData();

        body.append("id", e);

        SecureFetch("http://localhost:3001/db/removeTime", {
            method: "delete",
            body: body,
        })
            .then((response) => {
                console.log(response)
            })
    };
    return (
        <Modal

            className={"sticky"}
            onClose={() => {
                setOpen(false);
                props?.isOpenCallback(false);
            }}
            onOpen={() => {
                setOpen(true);
                props?.isOpenCallback(true);
            }}
            open={open}
            trigger={
                <div >
                    {props.trigger || <Button icon>
                        <Icon name="eye" />
                    </Button>}
                </div>
            }
            header={`Time Submission For ${props.user}`}
            actions={[{ content: "Close", key: 0 }]}
                content={{
                    content: <div>
                        <p>
                            <b>Semester/Project:</b> {props.semesterName} - {props.projectName}
                        </p>
                        <p><b>Date of
                            Work: </b>{formatDate(props.timeLog.work_date)}
                        </p>
                        <p><b>Total
                            Time: </b>{props.timeLog.time_amount}
                        </p>
                        <p><b>Description
                            : </b>{props.timeLog.work_comment}
 </p>
                        <ModalActions>
                            <Button  onClick={() => setOpen(false)}>
                              Close
                            </Button>
                            <Button
                              onClick={() => handleDelete(props.id)}
                            >
                                Delete Entry
                            </Button>

                          </ModalActions>
                    </div>
                }}
        />
    );
}


// <Modal
//     key = {timeLog}
//     className={"sticky"}
//     onOpen={() => {
//         setOpen(true);
//
//     }}
//     open={isOpen}
//     trigger={
//         <div >
//             {props.trigger || <Button icon>
//                 <Icon name="eye" />
//             </Button>}
//         </div>
//     }
//     header={`Time Submission For ${submittedBy}`}
//     content={{
//         content: <div>
//             <p>
//                 <b>Semester/Project:</b> {idx} - {currProj.title}
//             </p>
//             <p><b>Date of
//                 Work: </b>{formatDate(timeLog.work_date)}
//             </p>
//             <p><b>Total
//                 Time: </b>{timeLog.time_amount}
//             </p>
//             <p><b>Comment
//                 : </b>{timeLog.time_amount}
//             </p>
//             <ModalActions>
//                 <Button  onClick={() => setOpen(false)}>
//                   Close
//                 </Button>
//                 <Button
//                   // onClick={() => handleDelete(e)}
//                 >
//                     Delete Entry
//                 </Button>
//
//               </ModalActions>
//         </div>
//     }}
// />
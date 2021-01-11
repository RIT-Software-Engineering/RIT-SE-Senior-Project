import React from "react";
import { Button, Modal } from 'semantic-ui-react';

export default function ActionModal(props){
    const [open, setOpen] = React.useState(false);

    return(

        <Modal
            onClose={() => {
                setOpen(false);
                props.isOpenCallback(false);
            }}
            onOpen={() => {
                setOpen(true);
                props.isOpenCallback(true);
            }}
            open={open}
            trigger={<Button>Show Modal</Button>}
        >
            <Modal.Header>{props.action_title}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <div className="content" dangerouslySetInnerHTML={{ __html: props.page_html }} />
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => {
                    onActionCancel();
                    setOpen(false);
                    props.isOpenCallback(false);
                }}>
                    Cancel
                </Button>
                <Button
                    content="Submit"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => {
                        onActionSubmit(props.id);
                        setOpen(false);
                        props.isOpenCallback(false);
                    }}
                    positive
                />
            </Modal.Actions>
        </Modal>

    );


    function onActionSubmit(id){
        console.log(document.getElementsByClassName('form'));
    }

    function onActionCancel(){

    }
}

import React from 'react';
import { Modal as SemanticUIModal } from 'semantic-ui-react';

/*
    A wrapper for semantic UI's Modal to prevent the Modal from closing when clicked outside of it.

    USE this component to override Semantic UI React's Modal's default close behavior; 
*/
const Modal  = (props) => {
    return <SemanticUIModal closeOnDimmerClick={false} {...props}  />;
}

export default Modal;
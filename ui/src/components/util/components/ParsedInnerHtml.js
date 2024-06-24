import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';


const parseAttributes = (attribs) => {
    const parsedAttribs = {};
    for (const key in attribs) {
        try {
            parsedAttribs[key] = JSON.parse(attribs[key]);
        } catch (e) {
            parsedAttribs[key] = attribs[key];
        }
    }


    return parsedAttribs;
};


const parseHTML = (html, components,studentList) => {
    const componentsLowerCase = {};
    Object.keys(components).forEach(key => {
        componentsLowerCase[key.toLowerCase()] = key;
    });

    return parse(html, {
        replace: (node) => {
            if (node.type !== 'tag') return;
            const componentKey = componentsLowerCase[node.name.toLowerCase()];
            if (!componentKey) return;

            // Note: Normal question feedbacks are for coach not particularly for adding students
            // Only QuestionStudentFeedback should be used for student ones.
            // QuestionStudentFeedback could be made to also allow anonymous questions.
            if (studentList && componentKey !== "QuestionFeedback"){
                node.attribs['students'] = studentList;
            }


            const Component = components[componentKey];
            return <Component {...parseAttributes(node.attribs)} />;
        },
    });
};

const ParsedInnerHTML = ({ html, components, studentsList=["Student 1","Student 2","Student 3","Student 4"] }) => {
    return (
        <div >

            {parseHTML(html, components,studentsList)}
        </div>
    );
};

ParsedInnerHTML.propTypes = {
    html: PropTypes.string.isRequired,
    components: PropTypes.objectOf(PropTypes.elementType).isRequired
};

export default ParsedInnerHTML;

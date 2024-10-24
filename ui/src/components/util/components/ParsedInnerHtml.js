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

const parseHTML = (html, components,studentList, errorFields, submitter) => {
    const componentsLowerCase = {};
    Object.keys(components).forEach(key => {
        componentsLowerCase[key.toLowerCase()] = key;
    });

    return parse(html, {
        replace: (node) => {
            if (node.type !== 'tag') return;
            const componentKey = componentsLowerCase[node.name.toLowerCase()];
            if (!componentKey) return;

            // NOTE: This injects the student names and "SELF" name into the Question Components.
            if (studentList && node.attribs['includestudents'] && node.attribs['includestudents'] === "true") {
                if (node.attribs['selffeedback'] && node.attribs['selffeedback'] === "true") {
                    node.attribs['students'] = [...studentList, submitter]

                } else {
                    node.attribs['students'] = studentList;
                }
            }

            node.attribs['errorFields'] = errorFields

            const Component = components[componentKey];
            return <Component {...parseAttributes(node.attribs)} />;
        },
    });
};

function ParsedInnerHTML({
                             html,
                             components,
                             studentsList = ["Student 1", "Student 2", "Student 3", "Student 4"],
                             errorFields = new Set(),
                             submitter = "Student (SELF)"
                         }) {
    return (
        <div>
            {parseHTML(html, components, studentsList, errorFields, submitter)}
        </div>
    );
}

ParsedInnerHTML.propTypes = {
    html: PropTypes.string.isRequired,
    components: PropTypes.objectOf(PropTypes.elementType).isRequired,
    studentsList: PropTypes.arrayOf(PropTypes.string),
    errorFields: PropTypes.instanceOf(Set),
    submitter: PropTypes.string
};

export default ParsedInnerHTML;
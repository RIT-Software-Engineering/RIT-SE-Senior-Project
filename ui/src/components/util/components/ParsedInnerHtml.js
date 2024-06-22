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

            if (studentList){
                node.attribs['students'] = studentList;
            }


            const Component = components[componentKey];
            return <Component {...parseAttributes(node.attribs)} />;
        },
    });
};

const ParsedInnerHTML = ({ html, components, studentsList }) => {
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

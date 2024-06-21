import React from 'react';
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
}

const parseHTML = (html, components) => {
    const componentsLowerCase = {}
    Object.keys(components).forEach(key => componentsLowerCase[key.toLowerCase()] = key);

    return parse(html, {
        replace: (node) => {
            if (node.type !== 'tag') return;
            if (!componentsLowerCase[node.name]) return;

            node.name = componentsLowerCase[node.name]

            const Component = components[node.name];
            return <Component {...parseAttributes(node.attribs)}/>
        },
    });
};

const ParsedInnerHTML = ({html, components}) => {
    return <div>

        {parseHTML(html, components)}

    </div>;
};

export default ParsedInnerHTML;

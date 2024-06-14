import React from 'react';
import parse from 'html-react-parser';

const parseHTML = (html, components) => {
  return parse(html, {
    replace: (node) => {
      if (node.type === 'tag' && components[node.name]) {
        const Component = components[node.name];
        return <Component {...node.attribs} />;
      }
    },
  });
};

const ParsedInnerHTML = ({ html, components }) => {
  return <div>{parseHTML(html, components)}</div>;
};

export default ParsedInnerHTML;

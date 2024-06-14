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
  return parse(html, {
    replace: (node) => {
      if (node.type == 'tag' && node.name.startsWith('question')) {
        switch(node.name) {
          case 'questionfeedback':
            node.name = 'QuestionFeedback';
            break;
          case 'questiontable':
            node.name = 'QuestionTable';
            break;
          case 'questionmoodrating':
            node.name = 'QuestionMoodRating';
            break;
        }
      }
      
      if (node.type === 'tag' && components[node.name]) {
        const Component = components[node.name];
        return <Component {...parseAttributes(node.attribs)}/>
      }
    },
  });
};

const ParsedInnerHTML = ({ html, components }) => {
  return <div>

    {parseHTML(html, components)}

  </div>;
};

export default ParsedInnerHTML;

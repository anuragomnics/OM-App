import {parse} from 'node-html-parser';

export const getParsedTextFromHTML = (html: string) => {
  if (!html) {
    return '';
  }

  const root = parse(html, {
    blockTextElements: {
      script: true, // keep text content when parsing
      noscript: true, // keep text content when parsing
      style: true, // keep text content when parsing
      pre: true, // keep text content when parsing
    },
  });

  return root.structuredText;
};

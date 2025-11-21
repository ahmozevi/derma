import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="markdown-content text-sm leading-relaxed">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-slate-800" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="text-slate-700" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-md font-bold mb-2 mt-1" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

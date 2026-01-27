import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose max-w-none dark:prose-invert w-full overflow-x-auto">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]} 
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

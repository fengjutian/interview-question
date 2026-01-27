import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css/github-markdown.css';

interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark' | 'default';
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme = 'light' }) => {
  const getThemeAttribute = () => {
    switch (theme) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      case 'default':
      default:
        return undefined;
    }
  };

  return (
    <div 
      className="markdown-body w-full overflow-x-auto" 
      data-theme={getThemeAttribute()}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]} 
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

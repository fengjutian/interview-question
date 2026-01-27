import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css/github-markdown.css';
import 'github-markdown-css/github-markdown-light.css';
import 'github-markdown-css/github-markdown-dark.css';

interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark' | 'default';
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme = 'light' }) => {
  const getThemeClass = () => {
    switch (theme) {
      case 'dark':
        return 'markdown-body github-markdown-dark';
      case 'default':
        return 'markdown-body';
      case 'light':
      default:
        return 'markdown-body github-markdown-light';
    }
  };

  return (
    <div className={`${getThemeClass()} w-full overflow-x-auto`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]} 
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

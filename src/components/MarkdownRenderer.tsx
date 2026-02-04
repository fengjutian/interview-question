import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'github-markdown-css/github-markdown.css';

interface MarkdownRendererProps {
  content: string;
  theme?: 'light' | 'dark' | 'default';
  searchTerm?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, theme = 'light', searchTerm = '' }) => {
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

  // 高亮显示搜索结果
  const highlightSearchResults = (text: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      new RegExp(`^${searchTerm}$`, 'gi').test(part) 
        ? <mark key={index} className="bg-yellow-200">{part}</mark> 
        : part
    );
  };

  // 自定义渲染器，处理文本高亮
  const components = {
    p: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <p>{highlightedChildren}</p>;
    },
    h1: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h1>{highlightedChildren}</h1>;
    },
    h2: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h2>{highlightedChildren}</h2>;
    },
    h3: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h3>{highlightedChildren}</h3>;
    },
    h4: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h4>{highlightedChildren}</h4>;
    },
    h5: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h5>{highlightedChildren}</h5>;
    },
    h6: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h6>{highlightedChildren}</h6>;
    },
    li: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <li>{highlightedChildren}</li>;
    },
    blockquote: ({ node, children }) => {
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <blockquote>{highlightedChildren}</blockquote>;
    },
  };

  return (
    <div 
      className="markdown-body w-full overflow-x-auto" 
      data-theme={getThemeAttribute()}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]} 
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

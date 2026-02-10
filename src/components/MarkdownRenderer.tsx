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

  // 移除 Markdown 文件开头的元数据部分
  const removeMetadata = (content: string): string => {
    // 检查内容是否以 --- 开头
    if (content.startsWith('---')) {
      // 找到第二个 --- 的位置
      const endOfMetadataIndex = content.indexOf('---', 3);
      if (endOfMetadataIndex !== -1) {
        // 移除元数据部分，返回剩余内容
        return content.substring(endOfMetadataIndex + 3).trim();
      }
    }
    // 如果没有元数据，直接返回原内容
    return content;
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

  // 自定义渲染器，处理文本高亮和图片路径
  const components = {
    img: (props: any) => {
      const { src, alt, title } = props;
      // 处理图片路径，将相对路径转换为绝对路径
      let imgSrc = src;
      if (src && src.startsWith('imgs/')) {
        imgSrc = `/imgs/${src.substring(5)}`;
      }
      return <img src={imgSrc} alt={alt} title={title} className="max-w-full h-auto rounded" />;
    },
    p: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <p>{highlightedChildren}</p>;
    },
    h1: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h1>{highlightedChildren}</h1>;
    },
    h2: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h2>{highlightedChildren}</h2>;
    },
    h3: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h3>{highlightedChildren}</h3>;
    },
    h4: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h4>{highlightedChildren}</h4>;
    },
    h5: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h5>{highlightedChildren}</h5>;
    },
    h6: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <h6>{highlightedChildren}</h6>;
    },
    li: (props: any) => {
      const { children } = props;
      const highlightedChildren = Array.isArray(children) 
        ? children.map((child, i) => 
            typeof child === 'string' ? highlightSearchResults(child) : child
          )
        : typeof children === 'string' 
        ? highlightSearchResults(children)
        : children;
      
      return <li>{highlightedChildren}</li>;
    },
    blockquote: (props: any) => {
      const { children } = props;
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
        {removeMetadata(content)}
      </ReactMarkdown>
    </div>
  );
};

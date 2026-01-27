import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // 简单的 Markdown 渲染实现
  const renderMarkdown = (text: string): string => {
    // 替换标题
    text = text.replace(/^#{1,6}\s+(.+)$/gm, (match, p1) => {
      const level = match.match(/^#{1,6}/)?.[0].length || 1;
      return `<h${level}>${p1}</h${level}>`;
    });
    
    // 替换粗体
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 替换斜体
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 替换代码
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // 替换链接
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // 替换无序列表
    text = text.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');
    
    // 替换有序列表
    text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*?<\/li>)/s, '<ol>$1</ol>');
    
    // 替换段落
    text = text.replace(/^(?!<h|<ul|<ol|<li|<code|<strong|<em|<a).+$/gm, '<p>$&</p>');
    
    return text;
  };

  return (
    <div 
      className="prose max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

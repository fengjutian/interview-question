import React, { useEffect, useRef } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    
    // 替换行内代码
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // 替换代码块
    text = text.replace(/^```(.*?)$\n([\s\S]*?)^```$/gm, (match, lang, code) => {
      // 标准化语言名称
      const normalizedLang = lang.toLowerCase();
      const supportedLangs = ['python', 'js', 'javascript', 'ts', 'typescript', 'css', 'html', 'java'];
      const finalLang = supportedLangs.includes(normalizedLang) ? normalizedLang : (lang || 'plaintext');
      return `<pre><code class="language-${finalLang}">${code}</code></pre>`;
    });
    
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

  // 简单的语法高亮模拟
  useEffect(() => {
    if (containerRef.current) {
      const codeElements = containerRef.current.querySelectorAll('code');
      codeElements.forEach(code => {
        const lang = code.className.replace('language-', '');
        const content = code.textContent || '';
        
        // 根据语言进行简单的语法高亮
        let highlightedContent = content;
        
        switch (lang) {
          case 'python':
            // Python 关键字
            highlightedContent = highlightedContent
              .replace(/\b(def|class|import|from|if|elif|else|for|while|in|return|print|True|False|None)\b/g, '<span class="text-blue-600">$1</span>')
              .replace(/\b(\d+)(\.\d+)?\b/g, '<span class="text-green-600">$1$2</span>')
              .replace(/"(.*?)"/g, '<span class="text-orange-600">"$1"</span>')
              .replace(/'(.*?)'/g, '<span class="text-orange-600">\'$1\'</span>');
            break;
          case 'js':
          case 'javascript':
          case 'ts':
          case 'typescript':
            // JS/TS 关键字
            highlightedContent = highlightedContent
              .replace(/\b(function|const|let|var|if|else|for|while|return|import|export|class|extends|super|this|true|false|null|undefined)\b/g, '<span class="text-blue-600">$1</span>')
              .replace(/\b(\d+)(\.\d+)?\b/g, '<span class="text-green-600">$1$2</span>')
              .replace(/"(.*?)"/g, '<span class="text-orange-600">"$1"</span>')
              .replace(/'(.*?)'/g, '<span class="text-orange-600">\'$1\'</span>')
              .replace(/\/\*(.*?)\*\//gs, '<span class="text-gray-600">/*$1*/</span>')
              .replace(/\/\/.*$/gm, '<span class="text-gray-600">$&</span>');
            break;
          case 'css':
            // CSS 语法
            highlightedContent = highlightedContent
              .replace(/\b(selector|property|value)\b/g, '<span class="text-blue-600">$1</span>')
              .replace(/\b(#\w+|\.\w+|\w+)\s*{/g, '<span class="text-purple-600">$1</span> {')
              .replace(/:\s*(.*?);/g, ': <span class="text-orange-600">$1</span>;')
              .replace(/\b(color|font-size|margin|padding|width|height|background)\b:/g, '<span class="text-green-600">$1</span>:');
            break;
          case 'html':
            // HTML 语法
            highlightedContent = highlightedContent
              .replace(/<(\w+)([^>]*)>/g, '<span class="text-blue-600">&lt;$1</span><span class="text-purple-600">$2</span><span class="text-blue-600">&gt;</span>')
              .replace(/<\/(\w+)>/g, '<span class="text-blue-600">&lt;/$1&gt;</span>')
              .replace(/\b(class|id|href|src|alt)\s*=\s*"(.*?)"/g, '<span class="text-green-600">$1</span>=<span class="text-orange-600">"$2"</span>');
            break;
          case 'java':
            // Java 关键字
            highlightedContent = highlightedContent
              .replace(/\b(public|private|protected|class|interface|extends|implements|import|package|static|final|void|int|double|boolean|String|if|else|for|while|return|true|false|null)\b/g, '<span class="text-blue-600">$1</span>')
              .replace(/\b(\d+)(\.\d+)?\b/g, '<span class="text-green-600">$1$2</span>')
              .replace(/"(.*?)"/g, '<span class="text-orange-600">"$1"</span>')
              .replace(/\/\*(.*?)\*\//gs, '<span class="text-gray-600">/*$1*/</span>')
              .replace(/\/\/.*$/gm, '<span class="text-gray-600">$&</span>');
            break;
        }
        
        code.innerHTML = highlightedContent;
      });
    }
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className="prose max-w-none dark:prose-invert w-full overflow-x-auto"
      style={{ maxWidth: '100%', wordBreak: 'break-word' }}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

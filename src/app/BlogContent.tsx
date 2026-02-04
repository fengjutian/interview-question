"use client";

import { useState } from "react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  file: string;
}

interface BlogContentProps {
  articles: Article[];
  articleContents: Record<string, string>;
}

export default function BlogContent({ articles, articleContents }: BlogContentProps) {
  // 状态管理：当前选中的文章
  const [selectedArticle, setSelectedArticle] = useState(articles[0]);
  // 状态管理：当前主题
  const [theme, setTheme] = useState<'light' | 'dark' | 'default'>('light');
  const markdownContent = articleContents[selectedArticle.file];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)]">
      {/* 左侧内容 */}
      <div className="lg:w-[800px] bg-white p-6 rounded-lg flex-shrink-0 min-w-0 overflow-y-auto">
        {/* 主题切换按钮 */}
        <div className="mb-4 flex gap-2 sticky top-0 bg-white pt-1 pb-1 z-10">
          <button 
            onClick={() => setTheme('light')}
            className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            浅色
          </button>
          <button 
            onClick={() => setTheme('dark')}
            className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            深色
          </button>
          <button 
            onClick={() => setTheme('default')}
            className={`px-3 py-1 rounded ${theme === 'default' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            默认
          </button>
        </div>
        <div className="w-full">
          <MarkdownRenderer content={markdownContent} theme={theme} />
        </div>
      </div>
      {/* 右侧列表 */}
      <div className="lg:w-[320px] bg-white p-6 rounded-lg flex-shrink-0 min-w-0 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white pt-1 pb-1 z-10">文章列表</h2>
        {articles.map(article => (
          <div 
            key={article.id} 
            className={`border-b pb-4 cursor-pointer hover:bg-gray-50 ${selectedArticle.id === article.id ? 'bg-gray-50' : ''}`}
            onClick={() => setSelectedArticle(article)}
          >
            <h3 className={`text-lg hover:text-blue-600 ${selectedArticle.id === article.id ? 'text-blue-600' : ''}`}>
              {article.title}
            </h3>
            <p className="text-sm text-gray-500">{article.date}</p>
            <p className="text-sm text-gray-600">{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

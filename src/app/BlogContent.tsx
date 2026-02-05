"use client";

import React, { useState } from "react";
import { FloatButton, SideSheet } from '@douyinfe/semi-ui';
import { IconAIEditLevel1 } from '@douyinfe/semi-icons';
import { MarkdownRenderer } from "../components/MarkdownRenderer";

interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  file: string;
  category: string;
  tags: string[];
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
  // 状态管理：搜索关键词
  const [searchTerm, setSearchTerm] = useState('');
  // 状态管理：侧边栏可见性
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  // 状态管理：当前选中的分类
  const [selectedCategory, setSelectedCategory] = useState('全部');
  // 状态管理：防抖搜索关键词
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const markdownContent = articleContents[selectedArticle.file];
  
  // 提取所有唯一的分类
  const categories = ['全部', ...Array.from(new Set(articles.map(article => article.category)))];
  
  // 防抖处理
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // 根据分类和搜索关键词筛选文章
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
    const matchesSearch = !debouncedSearchTerm || 
      article.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
      article.summary.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  // 高亮显示搜索结果
  const highlightSearchResults = (content: string) => {
    if (!debouncedSearchTerm) return content;
    
    const regex = new RegExp(`(${debouncedSearchTerm})`, 'gi');
    return content.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

   const onClick = () => {
      setSideSheetVisible(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)]">
      {/* 左侧内容 */}
      <div className="lg:w-[800px] bg-white p-6 rounded-lg flex-shrink-0 min-w-0 overflow-y-auto">
        
        {/* 搜索框 */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* 搜索图标 */}
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* 清除按钮 */}
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* 分类筛选 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full">
          <MarkdownRenderer content={markdownContent} theme={theme} searchTerm={searchTerm} />
        </div>
      </div>
      {/* 右侧列表 */}
      <div className="lg:w-[320px] bg-white p-6 rounded-lg flex-shrink-0 min-w-0 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white pt-1 pb-1 z-10">文章列表</h2>
        {filteredArticles.map(article => (
          <div 
            key={article.id} 
            className={`border-b pb-4 cursor-pointer hover:bg-green-50 ${selectedArticle.id === article.id ? 'bg-green-50' : ''}`}
            onClick={() => setSelectedArticle(article)}
          >
            <div className="flex justify-between items-start">
              <h3 className={`text-lg hover:text-green-600 ${selectedArticle.id === article.id ? 'text-green-600' : ''}`}>
                {article.title}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                {article.category}
              </span>
            </div>
            <p className="text-sm text-gray-500">{article.date}</p>
            <p className="text-sm text-gray-600">{article.summary}</p>
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {article.tags.map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <FloatButton icon={<IconAIEditLevel1 />} style={{ bottom: '20px' }} onClick={onClick}/>
      
      {/* 侧边栏 */}
      <SideSheet
        title="AI"
        visible={sideSheetVisible}
        onCancel={() => setSideSheetVisible(false)}
        width={'30%'}
        placement="right"
        mask={false}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">AI 辅助编辑</h3>
          <p className="mb-4">使用 AI 工具来帮助你编辑和优化 Markdown 内容。</p>
          <div className="border rounded-lg p-4">
            <h4 className="text-md font-medium mb-2">功能特点：</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>自动语法检查</li>
              <li>内容优化建议</li>
              <li>代码格式美化</li>
              <li>标题层级调整</li>
            </ul>
          </div>
        </div>
      </SideSheet>
    </div>
  );
}

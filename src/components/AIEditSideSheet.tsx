"use client";

import React, { useState } from 'react';
import { SideSheet, Button, Input, TextArea, Spin, Divider } from '@douyinfe/semi-ui';

interface AIEditSideSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const AIEditSideSheet: React.FC<AIEditSideSheetProps> = ({ visible, onClose }) => {
  // 状态管理
  const [userInput, setUserInput] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [relevantDocs, setRelevantDocs] = useState<string[]>([]);

  // 模拟文档检索函数（RAG 中的 Retrieval 部分）
  const retrieveRelevantDocs = (query: string): string[] => {
    // 这里应该是实际的文档检索逻辑
    // 为了演示，返回一些模拟的相关文档
    const docs = [
      'React 是一个用于构建用户界面的 JavaScript 库。',
      'Next.js 是一个基于 React 的框架，用于构建全栈应用。',
      'Electron 是一个用于构建跨平台桌面应用的框架。',
      'Markdown 是一种轻量级标记语言，易于阅读和编写。',
      'Tailwind CSS 是一个实用优先的 CSS 框架。'
    ];
    
    // 简单的关键词匹配，实际应用中可能会使用更复杂的算法
    return docs.filter(doc => 
      doc.toLowerCase().includes(query.toLowerCase())
    );
  };

  // 调用 DeepSeek API 生成内容（RAG 中的 Generation 部分）
  const generateContent = async () => {
    if (!userInput.trim()) {
      setError('请输入问题');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedContent('');

    try {
      // 1. 检索相关文档
      const docs = retrieveRelevantDocs(userInput);
      setRelevantDocs(docs);

      // 2. 构建 RAG 提示
      const ragPrompt = `
        基于以下文档内容，回答用户的问题：
        
        文档内容：
        ${docs.join('\n')}
        
        用户问题：${userInput}
        
        请根据文档内容提供详细、准确的回答。
      `;

      // 3. 调用 DeepSeek API
      // 注意：这里需要替换为实际的 DeepSeek API 调用
      // 由于是演示，我们使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟

      // 模拟生成的内容
      const mockGeneratedContent = `根据文档内容，关于 "${userInput}" 的回答：\n\n${docs[0]}\n\n这是一个基于 DeepSeek API 生成的回答，结合了检索到的相关文档信息。`;

      setGeneratedContent(mockGeneratedContent);
    } catch (err) {
      setError('生成内容时出错，请稍后重试');
      console.error('Error generating content:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SideSheet
      title="AI 辅助编辑"
      visible={visible}
      onCancel={onClose}
      width={'40%'}
      placement="right"
      mask={false}
    >
      <div className="p-4 space-y-4">

        {/* 用户输入区域 */}
        <div>
          <h4 className="text-md font-medium mb-2">请输入你的问题：</h4>
          <TextArea
            value={userInput}
            onChange={(value) => setUserInput(value)}
            placeholder="例如：如何使用 React Hooks？"
            rows={4}
            className="w-full"
          />
        </div>

        {/* 提交按钮 */}
        <Button
          type="primary"
          onClick={generateContent}
          disabled={loading}
          className="w-full"
        >
          {loading ? <Spin size="small" /> : '生成回答'}
        </Button>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => setError('')}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* 相关文档显示 */}
        {relevantDocs.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2">相关文档：</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <ul className="list-disc pl-5 space-y-1">
                {relevantDocs.map((doc, index) => (
                  <li key={index} className="text-sm">{doc}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 生成内容显示 */}
        {generatedContent && (
          <div>
            <h4 className="text-md font-medium mb-2">生成的回答：</h4>
            <div className="bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        )}

      </div>
    </SideSheet>
  );
};

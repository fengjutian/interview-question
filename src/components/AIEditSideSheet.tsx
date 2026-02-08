"use client";

import React from 'react';
import { SideSheet } from '@douyinfe/semi-ui';

interface AIEditSideSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const AIEditSideSheet: React.FC<AIEditSideSheetProps> = ({ visible, onClose }) => {
  return (
    <SideSheet
      title="AI 辅助编辑"
      visible={visible}
      onCancel={onClose}
      width={'30%'}
      placement="right"
      mask={false}
    >
      <div className="p-2">
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
  );
};

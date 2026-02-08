"use client";

import React from 'react';
import { IconFolder, IconFile, IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { Modal } from '@douyinfe/semi-ui';

interface FileTreeActionsProps {
  node: {
    key: string;
    label: string;
    children?: any[];
  };
  onAddFolder: (parentKey: string) => void;
  onAddFile: (parentKey: string) => void;
  onDelete: (key: string) => void;
  onRename: (key: string, label: string) => void;
}

export const FileTreeActions: React.FC<FileTreeActionsProps> = ({ 
  node, 
  onAddFolder, 
  onAddFile, 
  onDelete, 
  onRename 
}) => {
  return (
    <div className="flex gap-1 items-center">
      {node.children && (
        <>
          <button 
            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
            onClick={(e) => { 
              e.stopPropagation(); 
              onAddFolder(node.key); 
            }}
            title="添加文件夹"
          >
            <IconFolder size="small" />
            <span>添加</span>
          </button>
          <button 
            className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors flex items-center gap-1"
            onClick={(e) => { 
              e.stopPropagation(); 
              onAddFile(node.key); 
            }}
            title="添加文件"
          >
            <IconFile size="small" />
            <span>添加</span>
          </button>
        </>
      )}
      <button 
        className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
          Modal.confirm({
            title: '确认删除',
            content: '确定要删除吗？',
            onOk: () => onDelete(node.key),
            okText: '确定',
            cancelText: '取消',
          });
        }}
        title="删除"
      >
        <IconDelete size="small" />
        <span>删除</span>
      </button>
      <button 
        className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition-colors flex items-center gap-1"
        onClick={(e) => { 
          e.stopPropagation(); 
          onRename(node.key, node.label); 
        }}
        title="重命名"
      >
        <IconEdit size="small" />
        <span>重命名</span>
      </button>
    </div>
  );
};

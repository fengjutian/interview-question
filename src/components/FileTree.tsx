"use client";

import React from 'react';
import { Tree } from '@douyinfe/semi-ui';
import { FileTreeActions } from './FileTreeActions';

interface FileTreeNode {
  key: string;
  label: string;
  value?: string;
  children?: FileTreeNode[];
}

interface FileTreeProps {
  treeData: FileTreeNode[];
  onAddRootFolder: () => void;
  onAddFolder: (parentKey: string) => void;
  onAddFile: (parentKey: string) => void;
  onDelete: (key: string) => void;
  onRename: (key: string, label: string) => void;
  onSelect: (selectedKey: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ 
  treeData, 
  onAddRootFolder, 
  onAddFolder, 
  onAddFile, 
  onDelete, 
  onRename, 
  onSelect 
}) => {
  const getTreeWithActions = () => {
    return treeData.map(node => ({
      ...node,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>{node.label}</span>
          <FileTreeActions 
            node={node}
            onAddFolder={onAddFolder}
            onAddFile={onAddFile}
            onDelete={onDelete}
            onRename={onRename}
          />
        </div>
      )
    }));
  };

  return (
    <div className="lg:w-[260px] bg-white p-6 rounded-lg flex-shrink-0 min-w-0 overflow-y-auto">
      <div className="mb-2 flex justify-end">
        <button 
          className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
          onClick={onAddRootFolder}
          title="添加根文件夹"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span>添加根文件夹</span>
        </button>
      </div>

      <Tree 
        treeData={getTreeWithActions() as any} 
        directory={true} 
        style={{ 
          width: '100%', 
          height: '600px', 
          maxHeight: 'calc(100vh - 200px)', 
          overflowY: 'auto', 
          border: '1px solid var(--semi-color-border)' 
        } as any} 
        onSelect={(selectedKey: string, selected: boolean) => {
          if (selectedKey && selected) {
            onSelect(selectedKey);
          }
        }}
      />
    </div>
  );
};

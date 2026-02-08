"use client";

import React, { useState, useEffect } from "react";
import { FloatButton, Modal, Input } from '@douyinfe/semi-ui';
import { IconAIEditLevel1, IconSourceControl } from '@douyinfe/semi-icons';
import { MarkdownRenderer } from "../components/MarkdownRenderer.js";
import { AIEditSideSheet } from "../components/AIEditSideSheet.js";
import { KnowledgeGraphSideSheet } from "../components/KnowledgeGraphSideSheet.js";
import { SearchBar } from "../components/SearchBar.js";
import { CategoryFilter } from "../components/CategoryFilter.js";
import { FileTree } from "../components/FileTree.js";

// 条件导入 Node.js 核心模块
let fs: any = null;
let path: any = null;
let fileURLToPath: any = null;

if (typeof window === 'undefined') {
  // 服务器端环境
  fs = require('fs');
  path = require('path');
  fileURLToPath = require('url').fileURLToPath;
}

interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  file: string;
  category: string;
  tags: string[];
}

interface FileTreeNode {
  label: string;
  value: string;
  key: string;
  children?: FileTreeNode[];
}

interface BlogContentProps {
  articles: Article[];
  articleContents: Record<string, string>;
  graphData: {
    nodes: Array<{
      id: string;
      label: string;
      group: number;
      size?: number;
    }>;
    links: Array<{
      source: string;
      target: string;
      value: number;
    }>;
  };
  fileList: string[];
  fileGraphDataMap: Record<string, any>;
  fileTreeData: FileTreeNode[];
}

export default function BlogContent({ articles, articleContents, graphData, fileList, fileGraphDataMap, fileTreeData }: BlogContentProps) {
  // 状态管理：当前选中的文章
  const [selectedArticle, setSelectedArticle] = useState(articles[0]);
  // 状态管理：当前主题
  const [theme, setTheme] = useState<'light' | 'dark' | 'default'>('light');
  // 状态管理：搜索关键词
  const [searchTerm, setSearchTerm] = useState('');
  // 状态管理：侧边栏可见性
  const [sideSheetVisible, setSideSheetVisible] = useState(false);
  // 状态管理：知识图谱侧边栏可见性
  const [knowledgeGraphVisible, setKnowledgeGraphVisible] = useState(false);
  // 状态管理：当前选中的分类
  const [selectedCategory, setSelectedCategory] = useState('全部');
  // 状态管理：防抖搜索关键词
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // 状态管理：目录树数据
  const [treeData, setTreeData] = useState(fileTreeData);

  // 对话框状态
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<'addRootFolder' | 'addFolder' | 'addFile' | 'rename'>('addRootFolder');
  const [dialogLabel, setDialogLabel] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [targetNodeKey, setTargetNodeKey] = useState<string | null>(null);
  const [currentLabel, setCurrentLabel] = useState('');

  // 获取 md 目录的绝对路径
  const getMdDirPath = (): string => {
    if (typeof window !== 'undefined') {
      // 浏览器环境
      return '';
    } else {
      // Node.js 环境
      return path.join(process.cwd(), 'src', 'md');
    }
  };

  // 确保目录存在
  const ensureDir = (dirPath: string): void => {
    if (typeof window === 'undefined' && fs && !fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  // 获取节点对应的文件系统路径
  const getNodePath = (node: FileTreeNode): string => {
    if (typeof window !== 'undefined') {
      return '';
    }
    const mdDir = getMdDirPath();
    // 构建完整路径
    const nodePath = node.value;
    return path.join(mdDir, nodePath);
  };

  // 同步目录树数据
  React.useEffect(() => {
    setTreeData(fileTreeData);
  }, [fileTreeData]);
  
  const markdownContent = articleContents[selectedArticle.file];
  
  // 提取所有唯一的分类
  const categories = ['全部', ...Array.from(new Set(articles.map(article => article.category)))];

  // 目录树操作函数
  const findNode = (key: string, nodes: FileTreeNode[], parent?: FileTreeNode, index?: number): 
    { node: FileTreeNode, parent?: FileTreeNode, index?: number } | null => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].key === key) {
        return { node: nodes[i], parent, index: i };
      }
      if (nodes[i].children) {
        const found = findNode(key, nodes[i].children!, nodes[i], i);
        if (found) return found;
      }
    }
    return null;
  };

  const addFolder = (parentKey: string | null, label: string) => {
    let relativePath = '';
    
    if (typeof window === 'undefined') {
      // 服务器端环境，执行文件系统操作
      const mdDir = getMdDirPath();
      let folderPath = '';
      
      if (parentKey === null) {
        // 添加到根节点
        folderPath = path.join(mdDir, label);
      } else {
        const found = findNode(parentKey, treeData);
        if (found) {
          const parentPath = getNodePath(found.node);
          folderPath = path.join(parentPath, label);
        }
      }
      
      // 确保目录存在
      ensureDir(folderPath);
      
      // 生成相对路径
      relativePath = folderPath.replace(mdDir, '').replace(/^[\\/]/, '').replace(/\\/g, '/');
    } else {
      // 客户端环境，仅生成相对路径
      if (parentKey === null) {
        relativePath = label;
      } else {
        const found = findNode(parentKey, treeData);
        if (found) {
          relativePath = `${found.node.value}/${label}`;
        }
      }
    }
    
    const newFolder: FileTreeNode = {
      label,
      value: relativePath,
      key: `folder_${Date.now()}`,
      children: []
    };
    
    if (parentKey === null) {
      // 添加到根节点
      setTreeData([...treeData, newFolder]);
    } else {
      const found = findNode(parentKey, treeData);
      if (found && found.node.children) {
        const updatedChildren = [...found.node.children, newFolder];
        const updatedNode = { ...found.node, children: updatedChildren };
        // 更新树数据
        const updateTree = (nodes: FileTreeNode[]): FileTreeNode[] => 
          nodes.map(node => node.key === found.node.key ? updatedNode : 
            node.children ? { ...node, children: updateTree(node.children) } : node);
        setTreeData(updateTree(treeData));
      }
    }
  };

  const addFile = (parentKey: string | null, label: string) => {
    // 确保文件名以 .md 结尾
    const fileName = label.endsWith('.md') ? label : `${label}.md`;
    let relativePath = '';
    
    if (typeof window === 'undefined') {
      // 服务器端环境，执行文件系统操作
      const mdDir = getMdDirPath();
      let filePath = '';
      
      if (parentKey === null) {
        // 添加到根节点
        filePath = path.join(mdDir, fileName);
      } else {
        const found = findNode(parentKey, treeData);
        if (found) {
          const parentPath = getNodePath(found.node);
          filePath = path.join(parentPath, fileName);
        }
      }
      
      // 确保目录存在
      ensureDir(path.dirname(filePath));
      
      // 创建默认的 Markdown 文件内容
      const defaultContent = `# ${label.replace('.md', '')}\n\n这是一个新的 Markdown 文件。`;
      
      // 写入文件
      fs.writeFileSync(filePath, defaultContent, 'utf8');
      
      // 生成相对路径
      relativePath = filePath.replace(mdDir, '').replace(/^[\\/]/, '').replace(/\\/g, '/');
    } else {
      // 客户端环境，仅生成相对路径
      if (parentKey === null) {
        relativePath = fileName;
      } else {
        const found = findNode(parentKey, treeData);
        if (found) {
          relativePath = `${found.node.value}/${fileName}`;
        }
      }
    }
    
    const newFile: FileTreeNode = {
      label: fileName,
      value: relativePath,
      key: `file_${Date.now()}`
    };
    
    if (parentKey === null) {
      // 添加到根节点（文件通常不在根节点，但允许）
      setTreeData([...treeData, newFile]);
    } else {
      const found = findNode(parentKey, treeData);
      if (found && found.node.children) {
        const updatedChildren = [...found.node.children, newFile];
        const updatedNode = { ...found.node, children: updatedChildren };
        // 更新树数据
        const updateTree = (nodes: FileTreeNode[]): FileTreeNode[] => 
          nodes.map(node => node.key === found.node.key ? updatedNode : 
            node.children ? { ...node, children: updateTree(node.children) } : node);
        setTreeData(updateTree(treeData));
      }
    }
  };

  const deleteNode = (key: string) => {
    const found = findNode(key, treeData);
    if (!found) return;
    
    if (typeof window === 'undefined') {
      // 服务器端环境，执行文件系统操作
      // 删除文件系统中的对应文件或文件夹
      const nodePath = getNodePath(found.node);
      if (fs && fs.existsSync(nodePath)) {
        if (found.node.children) {
          // 删除文件夹（递归删除）
          fs.rmSync(nodePath, { recursive: true, force: true });
        } else {
          // 删除文件
          fs.unlinkSync(nodePath);
        }
      }
    }
    
    if (!found.parent) {
      // 根节点
      setTreeData(treeData.filter((_, i) => i !== found.index));
    } else {
      const updatedChildren = found.parent.children!.filter((_, i) => i !== found.index);
      const updatedNode = { ...found.parent, children: updatedChildren };
      const updateTree = (nodes: FileTreeNode[]): FileTreeNode[] => 
        nodes.map(node => node.key === found.parent!.key ? updatedNode : 
          node.children ? { ...node, children: updateTree(node.children) } : node);
      setTreeData(updateTree(treeData));
    }
  };

  const renameNode = (key: string, newLabel: string) => {
    const found = findNode(key, treeData);
    if (!found) return;
    
    let updatedNode = { ...found.node, label: newLabel };
    
    if (typeof window === 'undefined') {
      // 服务器端环境，执行文件系统操作
      // 重命名文件系统中的对应文件或文件夹
      const oldPath = getNodePath(found.node);
      if (fs && fs.existsSync(oldPath)) {
        let newNodePath = '';
        if (found.node.children) {
          // 重命名文件夹
          const parentPath = path.dirname(oldPath);
          newNodePath = path.join(parentPath, newLabel);
        } else {
          // 重命名文件，确保扩展名正确
          const parentPath = path.dirname(oldPath);
          const ext = path.extname(oldPath);
          const baseName = newLabel.endsWith(ext) ? newLabel : `${newLabel}${ext}`;
          newNodePath = path.join(parentPath, baseName);
        }
        
        // 执行重命名
        fs.renameSync(oldPath, newNodePath);
        
        // 更新节点的 value（相对路径）
        const mdDir = getMdDirPath();
        const relativePath = newNodePath.replace(mdDir, '').replace(/^[\\/]/, '').replace(/\\/g, '/');
        updatedNode = { ...found.node, label: newLabel, value: relativePath };
      }
    }
    
    // 更新树数据
    const updateTree = (nodes: FileTreeNode[]): FileTreeNode[] => 
      nodes.map(node => node.key === found.node.key ? updatedNode : 
        node.children ? { ...node, children: updateTree(node.children) } : node);
    setTreeData(updateTree(treeData));
  };

  // 打开对话框
  const openDialog = (
    type: 'addRootFolder' | 'addFolder' | 'addFile' | 'rename',
    targetKey?: string,
    currentLabel?: string
  ) => {
    setDialogType(type);
    setTargetNodeKey(targetKey || null);
    setCurrentLabel(currentLabel || '');
    setInputValue(currentLabel || '');
    // 设置对话框标签
    let label = '';
    switch (type) {
      case 'addRootFolder':
        label = '请输入根文件夹名';
        break;
      case 'addFolder':
        label = '请输入文件夹名';
        break;
      case 'addFile':
        label = '请输入文件名';
        break;
      case 'rename':
        label = '请输入新名称';
        break;
    }
    setDialogLabel(label);
    setDialogVisible(true);
  };

  // 处理对话框确认
  const handleDialogOk = (e?: any) => {
    if (!inputValue.trim()) {
      // 输入为空，可以给出提示，这里直接关闭
      setDialogVisible(false);
      return;
    }
    switch (dialogType) {
      case 'addRootFolder':
        addFolder(null, inputValue);
        break;
      case 'addFolder':
        if (targetNodeKey) addFolder(targetNodeKey, inputValue);
        break;
      case 'addFile':
        if (targetNodeKey) addFile(targetNodeKey, inputValue);
        break;
      case 'rename':
        if (targetNodeKey) renameNode(targetNodeKey, inputValue);
        break;
    }
    setDialogVisible(false);
    setInputValue('');
  };

  // 防抖处理
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);


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
      {/* 左侧目录树 */}
      <FileTree 
        treeData={treeData}
        onAddRootFolder={() => openDialog('addRootFolder')}
        onAddFolder={(parentKey) => openDialog('addFolder', parentKey)}
        onAddFile={(parentKey) => openDialog('addFile', parentKey)}
        onDelete={deleteNode}
        onRename={(key, label) => openDialog('rename', key, label)}
        onSelect={(selectedKey) => {
          const findNodeByKey = (nodes: FileTreeNode[]): FileTreeNode | null => {
            for (const node of nodes) {
              if (node.key === selectedKey) {
                return node;
              }
              if (node.children) {
                const found = findNodeByKey(node.children);
                if (found) return found;
              }
            }
            return null;
          };
          const selectedNode = findNodeByKey(treeData);
          if (selectedNode && !selectedNode.children) {
            const selectedFilePath = selectedNode.value;
            // 标准化路径格式，确保与 articles 中的路径格式一致
            const normalizedPath = selectedFilePath.replace(/\\/g, '/');
            const correspondingArticle = articles.find(article => {
              const articleFileNormalized = article.file.replace(/\\/g, '/');
              return articleFileNormalized === normalizedPath;
            });
            if (correspondingArticle) {
              setSelectedArticle(correspondingArticle);
            }
          }
        }}
      />
        <Modal
          title={dialogLabel}
          visible={dialogVisible}
          onOk={handleDialogOk}
          onCancel={() => setDialogVisible(false)}
          closeOnEsc={true}
        >
          {/* @ts-ignore */}
          <Input
            {...{
              autoFocus: true,
              value: inputValue,
              onChange: (value: string) => setInputValue(value),
              placeholder: dialogLabel,
              onPressEnter: handleDialogOk,
            } as any}
          />
        </Modal>
      </div>

      <div className="lg:w-[800px] bg-white p-6 rounded-lg flex-shrink-0 min-w-0 overflow-y-auto">
        
        {/* 搜索框 */}
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          onClearSearch={clearSearch} 
        />
        
        {/* 分类筛选 */}
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <div className="w-full">
          <MarkdownRenderer content={markdownContent} theme={theme} searchTerm={searchTerm} />
        </div>
      </div>

      {/* 浮动按钮 */}
      <div className="fixed bottom-0 right-0 flex flex-col items-end gap-4 p-4">
        <FloatButton 
          icon={<IconSourceControl />} 
          style={{ bottom: '60px' }} 
          onClick={() => setKnowledgeGraphVisible(true)}
        />
        <FloatButton 
          icon={<IconAIEditLevel1 />} 
          style={{ bottom: '20px' }} 
          onClick={() => setSideSheetVisible(true)}
        />
      </div>

      {/* AI 辅助编辑侧边栏 */}
      <AIEditSideSheet 
        visible={sideSheetVisible} 
        onClose={() => setSideSheetVisible(false)} 
      />

      {/* 知识图谱侧边栏 */}
      <KnowledgeGraphSideSheet 
        visible={knowledgeGraphVisible} 
        onClose={() => setKnowledgeGraphVisible(false)}
        graphData={graphData}
        fileGraphDataMap={fileGraphDataMap}
        fileList={fileList}
      />
    </div>
  );
}

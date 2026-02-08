"use client";

import React, { useState, useEffect } from "react";
import { FloatButton, SideSheet, Tree, Modal, Input } from '@douyinfe/semi-ui';
import { IconAIEditLevel1, IconSourceControl, IconFolder, IconFile, IconDelete, IconEdit } from '@douyinfe/semi-icons';
import { MarkdownRenderer } from "../components/MarkdownRenderer.js";
import KnowledgeGraphClient from "./knowledge-graph/KnowledgeGraphClient.js";

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
      {/* 左侧目录树 */}
      <div className="lg:w-[260px] bg-white p-6 rounded-lg flex-shrink-0 min-w-0 overflow-y-auto">
        <div className="mb-2 flex justify-end">
          <button 
            className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
            onClick={() => openDialog('addRootFolder')}
            title="添加根文件夹"
          >
            <IconFolder size="small" />
            <span>添加根文件夹</span>
          </button>
        </div>
        {/* @ts-ignore */}
        <Tree 
          treeData={treeData.map(node => ({
            ...node,
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span>{node.label}</span>
                <div className="flex gap-1 items-center">
                  {node.children && (
                    <>
                      <button 
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
                        onClick={(e) => { e.stopPropagation(); openDialog('addFolder', node.key); }}
                        title="添加文件夹"
                      >
                        <IconFolder size="small" />
                        <span>添加</span>
                      </button>
                      <button 
                        className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors flex items-center gap-1"
                        onClick={(e) => { e.stopPropagation(); openDialog('addFile', node.key); }}
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
                        onOk: () => deleteNode(node.key),
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
                    onClick={(e) => { e.stopPropagation(); openDialog('rename', node.key, node.label); }}
                    title="重命名"
                  >
                    <IconEdit size="small" />
                    <span>重命名</span>
                  </button>
                </div>
              </div>
            )
          })) as any} 
          directory={true} 
          style={{ width: '100%', height: 'calc(100vh-200px)', border: '1px solid var(--semi-color-border)' } as any} 
          onSelect={(selectedKey: string, selected: boolean, selectedNodeData: any) => {
            if (selectedKey) {
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

      <FloatButton icon={< IconSourceControl />} style={{ bottom: '60px' }} onClick={() => setKnowledgeGraphVisible(true)}/>
      <FloatButton icon={<IconAIEditLevel1 />} style={{ bottom: '20px' }} onClick={() => setSideSheetVisible(true)}/>
      
      
      {/* 原有的侧边栏 */}
      <SideSheet
        title="AI 辅助编辑"
        visible={sideSheetVisible}
        onCancel={() => setSideSheetVisible(false)}
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
      
      {/* 知识图谱侧边栏 */}
      <SideSheet
        title="知识图谱"
        visible={knowledgeGraphVisible}
        onCancel={() => setKnowledgeGraphVisible(false)}
        width={'800px'}
        placement="right"
        mask={true}
      >
        <div className="h-[600px]">
          <KnowledgeGraphClient 
            allFilesGraphData={graphData}
            fileGraphDataMap={fileGraphDataMap}
            fileList={fileList}
          />
        </div>
      </SideSheet>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { KnowledgeGraphVisualizer } from "@/components/KnowledgeGraphVisualizer";
import * as d3 from "d3";

interface KnowledgeGraphClientProps {
  allFilesGraphData: {
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
  fileGraphDataMap: Record<string, {
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
  }>;
  fileList?: string[];
}

export default function KnowledgeGraphClient({ allFilesGraphData, fileGraphDataMap, fileList }: KnowledgeGraphClientProps) {
  // 状态管理：当前选择的文件
  const [selectedFile, setSelectedFile] = useState<string>("");
  // 状态管理：当前图谱数据
  const [currentGraphData, setCurrentGraphData] = useState(allFilesGraphData);
  // 状态管理：当前选中的颜色组
  const [selectedGroups, setSelectedGroups] = useState<Set<number>>(new Set());

  // 处理文件选择变化
  const handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fileName = e.target.value;
    setSelectedFile(fileName);
    setSelectedGroups(new Set());
    
    // 更新图谱数据
    if (fileName) {
      setCurrentGraphData(fileGraphDataMap[fileName] || allFilesGraphData);
    } else {
      setCurrentGraphData(allFilesGraphData);
    }
  };

  // 处理颜色组选择变化
  const handleGroupChange = (group: number) => {
    const newSelectedGroups = new Set(selectedGroups);
    if (newSelectedGroups.has(group)) {
      newSelectedGroups.delete(group);
    } else {
      newSelectedGroups.add(group);
    }
    setSelectedGroups(newSelectedGroups);
  };

  // 筛选图谱数据
  const getFilteredGraphData = () => {
    if (selectedGroups.size === 0) {
      return currentGraphData;
    }

    // 筛选节点
    const filteredNodes = currentGraphData.nodes.filter(node => 
      selectedGroups.has(node.group)
    );

    // 筛选链接
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    const filteredLinks = currentGraphData.links.filter(link => 
      nodeIds.has(link.source as string) && nodeIds.has(link.target as string)
    );

    return {
      nodes: filteredNodes,
      links: filteredLinks
    };
  };

  // 获取唯一的颜色组
  const uniqueGroups = [...new Set(currentGraphData.nodes.map(node => node.group))];

  return (
    <div>
      {/* 文件选择器 */}
      <div className="mb-6">
        <div className="flex gap-4">
          <select 
            value={selectedFile} 
            onChange={handleFileChange}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">所有文件</option>
            {fileList?.map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 颜色筛选器 */}
      {uniqueGroups.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            {uniqueGroups.map(group => {
              const isSelected = selectedGroups.has(group);
              return (
                <label 
                  key={group}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-colors ${isSelected ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}
                  style={{
                    border: `2px solid ${isSelected ? '#10b981' : '#d1d5db'}`
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleGroupChange(group)}
                    className="hidden"
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: d3.schemeCategory10[group % 10],
                      border: '2px solid #fff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }}
                  />
                  <span className="text-sm font-medium">组 {group}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 图谱可视化 */}
      <div className="h-[600px] border rounded-lg overflow-hidden shadow-sm">
        {currentGraphData && currentGraphData.nodes.length > 0 ? (
          <KnowledgeGraphVisualizer 
            data={getFilteredGraphData()} 
            width={800} 
            height={600} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>无法生成知识图谱数据</p>
          </div>
        )}
      </div>
    </div>
  );
}

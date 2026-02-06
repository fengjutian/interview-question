"use client";

import React, { useState } from "react";
import { KnowledgeGraphVisualizer } from "@/components/KnowledgeGraphVisualizer";

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

  // 处理文件选择变化
  const handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fileName = e.target.value;
    setSelectedFile(fileName);
    
    // 更新图谱数据
    if (fileName) {
      setCurrentGraphData(fileGraphDataMap[fileName] || allFilesGraphData);
    } else {
      setCurrentGraphData(allFilesGraphData);
    }
  };

  return (
    <div>
      {/* 文件选择器 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">选择文件进行分析</h3>
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
      
      {/* 图谱可视化 */}
      <div className="h-[600px] border rounded-lg overflow-hidden">
        {currentGraphData && currentGraphData.nodes.length > 0 ? (
          <KnowledgeGraphVisualizer 
            data={currentGraphData} 
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

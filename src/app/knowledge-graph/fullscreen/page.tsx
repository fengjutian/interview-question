import React from "react";
import { generateKnowledgeGraph, getMarkdownFileList, generateKnowledgeGraphForFile } from "@/utils/entityExtractor";
import KnowledgeGraphClient from "../KnowledgeGraphClient";

// 生成知识图谱数据
const allFilesGraphData = generateKnowledgeGraph();

// 获取Markdown文件列表
const fileList = getMarkdownFileList();

// 为每个文件生成知识图谱数据
const fileGraphDataMap = fileList.reduce((acc, file) => {
  const filePath = `src/md/${file}`;
  acc[file] = generateKnowledgeGraphForFile(filePath);
  return acc;
}, {} as Record<string, { nodes: Array<{ id: string; label: string; group: number; size?: number }>; links: Array<{ source: string; target: string; value: number }> }>);

export default function FullscreenKnowledgeGraph() {
  return (
    <div className="h-screen w-screen bg-white flex flex-col">
      <div className="p-6 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-gray-800">知识图谱 - 全屏模式</h1>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
        >
          关闭窗口
        </button>
      </div>
      <div className="flex-grow p-6 overflow-auto">
        <KnowledgeGraphClient
          allFilesGraphData={allFilesGraphData}
          fileGraphDataMap={fileGraphDataMap}
          fileList={fileList}
        />
      </div>
    </div>
  );
}

import React from "react";
import { generateKnowledgeGraph, getMarkdownFileList, generateKnowledgeGraphForFile } from "@/utils/entityExtractor";
import FullscreenKnowledgeGraphClient from "./FullscreenKnowledgeGraphClient";

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
      <FullscreenKnowledgeGraphClient
        allFilesGraphData={allFilesGraphData}
        fileGraphDataMap={fileGraphDataMap}
        fileList={fileList}
      />
    </div>
  );
}

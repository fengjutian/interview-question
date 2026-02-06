"use client";

import React from "react";
import KnowledgeGraphClient from "../KnowledgeGraphClient";

interface FullscreenKnowledgeGraphClientProps {
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

export default function FullscreenKnowledgeGraphClient({ allFilesGraphData, fileGraphDataMap, fileList }: FullscreenKnowledgeGraphClientProps) {
  const handleClose = () => {
    window.close();
  };

  return (
    <>
      <div className="p-6 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-gray-800">知识图谱 - 全屏模式</h1>
        <button
          onClick={handleClose}
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
    </>
  );
}

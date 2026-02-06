"use client";

import React from "react";
import { KnowledgeGraphVisualizer } from "@/components/KnowledgeGraphVisualizer";

interface KnowledgeGraphClientProps {
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
}

export default function KnowledgeGraphClient({ graphData }: KnowledgeGraphClientProps) {
  return (
    <div className="h-[600px] border rounded-lg overflow-hidden">
      {graphData && graphData.nodes.length > 0 ? (
        <KnowledgeGraphVisualizer 
          data={graphData} 
          width={800} 
          height={600} 
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>无法生成知识图谱数据</p>
        </div>
      )}
    </div>
  );
}

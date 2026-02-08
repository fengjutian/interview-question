"use client";

import React from 'react';
import { SideSheet } from '@douyinfe/semi-ui';
import KnowledgeGraphClient from '../app/knowledge-graph/KnowledgeGraphClient';

interface KnowledgeGraphSideSheetProps {
  visible: boolean;
  onClose: () => void;
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
}

export const KnowledgeGraphSideSheet: React.FC<KnowledgeGraphSideSheetProps> = ({ 
  visible, 
  onClose,
  graphData,
  fileList,
  fileGraphDataMap
}) => {
  return (
    <SideSheet
      title="知识图谱"
      visible={visible}
      onCancel={onClose}
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
  );
};

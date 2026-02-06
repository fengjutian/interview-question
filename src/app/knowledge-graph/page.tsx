import Image from "next/image";
import Link from "next/link";
import SettingsClient from "../SettingsClient";
import KnowledgeGraphClient from "./KnowledgeGraphClient";
import { generateKnowledgeGraph, generateKnowledgeGraphForFile, getMarkdownFileList } from "@/utils/entityExtractor";
import path from "path";

// 服务器端页面组件
export default function KnowledgeGraph() {
  // 获取所有Markdown文件列表
  const fileList = getMarkdownFileList();
  
  // 生成默认图谱数据（所有文件）
  const allFilesGraphData = generateKnowledgeGraph();
  
  // 预生成每个文件的图谱数据
  const fileGraphDataMap = new Map<string, any>();
  fileList.forEach(file => {
    const fullFilePath = path.join(process.cwd(), "src", "md", file);
    const fileGraphData = generateKnowledgeGraphForFile(fullFilePath);
    fileGraphDataMap.set(file, fileGraphData);
  });

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="max-w-[1200px] mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image src="/next.svg" alt="Logo" width={100} height={20} />
            <h1 className="text-3xl font-semibold">知识点分析系统</h1>
          </div>
          <div className="flex items-center gap-6">
            {/* <nav className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">首页</Link>
              <Link href="/knowledge-graph" className="text-gray-700 hover:text-green-600 font-medium">知识图谱</Link>
            </nav> */}
            <SettingsClient />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">技术文档实体关系</h2>
            <p className="text-gray-600">
              自动分析 <code>src/md</code> 目录下的技术文档，提取实体并生成关系图谱
            </p>
          </div>
          
          {/* 使用客户端组件展示图谱 */}
          <KnowledgeGraphClient 
            allFilesGraphData={allFilesGraphData}
            fileGraphDataMap={Object.fromEntries(fileGraphDataMap)}
            fileList={fileList}
          />
        </div>
      </main>
    </div>
  );
}


import Image from "next/image";
import Link from "next/link";
import SettingsClient from "../SettingsClient";
import KnowledgeGraphClient from "./KnowledgeGraphClient";
import { generateKnowledgeGraph, generateKnowledgeGraphForFile, getMarkdownFileList } from "@/utils/entityExtractor";
import path from "path";

// 服务器端页面组件
export default function KnowledgeGraph({ searchParams }: { searchParams?: Record<string, string> }) {
  // 获取所有Markdown文件列表
  const fileList = getMarkdownFileList();
  
  // 获取要分析的文件路径
  const selectedFile = searchParams?.file;
  
  // 生成图谱数据
  let graphData;
  if (selectedFile) {
    // 分析单个文件
    const fullFilePath = path.join(process.cwd(), "src", "md", selectedFile);
    graphData = generateKnowledgeGraphForFile(fullFilePath);
  } else {
    // 分析所有文件
    graphData = generateKnowledgeGraph();
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="max-w-[1200px] mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image src="/next.svg" alt="Logo" width={100} height={20} />
            <h1 className="text-3xl font-semibold">知识点分析系统</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-700 hover:text-green-600 font-medium">首页</Link>
              <Link href="/knowledge-graph" className="text-gray-700 hover:text-green-600 font-medium">知识图谱</Link>
            </nav>
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
          
          {/* 文件选择器 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">选择文件进行分析</h3>
            <div className="flex gap-4">
              <form action="/knowledge-graph" method="GET" className="flex gap-2">
                <select 
                  name="file" 
                  className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue={selectedFile || ""}
                >
                  <option value="">所有文件</option>
                  {fileList.map(file => (
                    <option key={file} value={file}>{file}</option>
                  ))}
                </select>
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  分析
                </button>
              </form>
              {selectedFile && (
                <Link 
                  href="/knowledge-graph" 
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  查看所有文件
                </Link>
              )}
            </div>
          </div>
          
          {/* 使用客户端组件展示图谱 */}
          <KnowledgeGraphClient 
            graphData={graphData} 
            fileList={fileList}
            selectedFile={selectedFile}
          />
        </div>
      </main>
    </div>
  );
}


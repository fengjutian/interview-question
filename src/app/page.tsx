import Image from "next/image";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import fs from "fs";
import path from "path";

// 文章列表数据
const articles = [
  { id: 1, title: "Markdown 渲染示例", date: "2026-01-27", summary: "示例页面", file: "example.md" },
  { id: 2, title: "Next.js 入门指南", date: "2026-01-26", summary: "Next.js 框架介绍", file: "nextjs-guide.md" },
  { id: 3, title: "React 组件开发", date: "2026-01-25", summary: "React 组件最佳实践", file: "react-components.md" },
  { id: 4, title: "Tailwind CSS 样式设计", date: "2026-01-24", summary: "Tailwind CSS 使用指南", file: "tailwind-css.md" },
  { id: 5, title: "TypeScript 入门指南", date: "2026-01-23", summary: "TypeScript 基础教程", file: "typescript.md" },
];

// 从src/md目录读取Markdown文件内容
function getMarkdownContent(fileName: string): string {
  const markdownPath = path.join(process.cwd(), "src", "md", fileName);
  return fs.readFileSync(markdownPath, "utf8");
}

export default function Home() {
  // 默认显示第一篇文章
  const defaultArticle = articles[0];
  const markdownContent = getMarkdownContent(defaultArticle.file);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <Image src="/next.svg" alt="Logo" width={100} height={20} />
          <h1 className="text-3xl font-semibold">Markdown 博客</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧内容 */}
          <div className="lg:w-2/3 bg-white p-6 rounded-lg">
            <MarkdownRenderer content={markdownContent} />
          </div>
          {/* 右侧列表 */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">文章列表</h2>
            {articles.map(article => (
              <div key={article.id} className="border-b pb-4">
                <h3 className="text-lg hover:text-blue-600">{article.title}</h3>
                <p className="text-sm text-gray-500">{article.date}</p>
                <p className="text-sm text-gray-600">{article.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

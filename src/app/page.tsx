import Image from "next/image";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import fs from "fs";
import path from "path";

export default function Home() {
  // 读取 Markdown 文件内容
  const markdownPath = path.join(process.cwd(), "src", "md", "example.md");
  const markdownContent = fs.readFileSync(markdownPath, "utf8");

  // 文章列表数据
  const articles = [
    {
      id: 1,
      title: "Markdown 渲染示例",
      date: "2026-01-27",
      summary: "这是一个使用 React Markdown 渲染的示例页面。",
      path: "/"
    },
    {
      id: 2,
      title: "Next.js 入门指南",
      date: "2026-01-26",
      summary: "学习 Next.js 的基本概念和使用方法。",
      path: "/nextjs-guide"
    },
    {
      id: 3,
      title: "React 组件开发",
      date: "2026-01-25",
      summary: "掌握 React 组件的开发技巧和最佳实践。",
      path: "/react-components"
    },
    {
      id: 4,
      title: "Tailwind CSS 样式设计",
      date: "2026-01-24",
      summary: "使用 Tailwind CSS 快速构建响应式界面。",
      path: "/tailwind-css"
    },
    {
      id: 5,
      title: "TypeScript 类型系统",
      date: "2026-01-23",
      summary: "深入了解 TypeScript 的类型系统和高级特性。",
      path: "/typescript"
    }
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-3xl font-semibold dark:text-white">Markdown 博客</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧文章内容 */}
          <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-sm dark:bg-gray-900 dark:text-white">
            <MarkdownRenderer content={markdownContent} />
          </div>
          
          {/* 右侧文章列表 */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-sm dark:bg-gray-900 dark:text-white">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">文章列表</h2>
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="border-b border-gray-200 pb-4 dark:border-gray-700">
                  <h3 className="font-medium text-lg hover:text-blue-600 dark:hover:text-blue-400">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{article.date}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{article.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

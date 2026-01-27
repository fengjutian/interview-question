import Image from "next/image";
import fs from "fs";
import path from "path";
import BlogContent from "./BlogContent";

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

// 预加载所有Markdown内容
const articleContents = articles.reduce((acc, article) => {
  acc[article.file] = getMarkdownContent(article.file);
  return acc;
}, {} as Record<string, string>);

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <Image src="/next.svg" alt="Logo" width={100} height={20} />
          <h1 className="text-3xl font-semibold">Markdown 博客</h1>
        </div>
        <BlogContent articles={articles} articleContents={articleContents} />
      </main>
    </div>
  );
}

import Image from "next/image";
import fs from "fs";
import path from "path";
import BlogContent from "./BlogContent";
import { generateSummary } from '@/utils/summary';
import SettingsClient from "./SettingsClient";

export const dynamic = 'force-dynamic';

// 从src/md目录读取Markdown文件内容
function getMarkdownContent(fileName: string): string {
  const markdownPath = path.join(process.cwd(), "src", "md", fileName);
  return fs.readFileSync(markdownPath, "utf8");
}

// 自动读取src/md目录下的所有Markdown文件
function getArticles() {
  const mdDirectory = path.join(process.cwd(), "src", "md");
  const files = fs.readdirSync(mdDirectory);
  
  // 过滤出.md文件并获取修改时间
  const mdFilesWithStats = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(mdDirectory, file);
      const stats = fs.statSync(filePath);
      return {
        file,
        mtime: stats.mtime
      };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()); // 按修改时间倒序排序
  
  // 生成文章元数据
  return mdFilesWithStats.map(({ file }, index) => {
    // 从文件名中提取标题（移除.md后缀）
    const title = file.replace('.md', '');
    
    // 读取文件内容以提取摘要
    const content = getMarkdownContent(file);
    const summary = generateSummary(content);
    
    // 使用当前日期作为默认日期
    const date = new Date().toISOString().split('T')[0];
    
    return {
      id: index + 1,
      title,
      date,
      summary,
      file
    };
  });
}

const articles = getArticles();

// 预加载所有Markdown内容
const articleContents = articles.reduce((acc, article) => {
  acc[article.file] = getMarkdownContent(article.file);
  return acc;
}, {} as Record<string, string>);

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="max-w-[1200px] mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Image src="/next.svg" alt="Logo" width={100} height={20} />
            <h1 className="text-3xl font-semibold">博客</h1>
          </div>
          <SettingsClient />
        </div>
        <BlogContent articles={articles} articleContents={articleContents} />
      </main>
    </div>
  );
}

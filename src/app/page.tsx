import Image from "next/image";
import fs from "fs";
import path from "path";
import Link from "next/link";
import BlogContent from "./BlogContent";
import { generateSummary } from '@/utils/summary';
import { generateKnowledgeGraph, generateKnowledgeGraphForFile, getMarkdownFileList } from "@/utils/entityExtractor";
import SettingsClient from "./SettingsClient";

// 解析YAML front matter
function parseFrontMatter(content: string) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = frontMatterRegex.exec(content);
  
  if (!match) {
    return { frontMatter: {}, content };
  }
  
  const frontMatterContent = match[1];
  const contentWithoutFrontMatter = content.replace(frontMatterRegex, "");
  
  // 简单解析YAML
  const frontMatter = frontMatterContent.split("\n").reduce((acc, line) => {
    const [key, ...valueParts] = line.split(": ");
    if (key && valueParts.length > 0) {
      const value = valueParts.join(": ").trim();
      // 处理数组类型
      if (value.startsWith("[") && value.endsWith("]")) {
        // 简单解析YAML数组，处理没有双引号的字符串
        const arrayContent = value.substring(1, value.length - 1).trim();
        if (arrayContent) {
          acc[key.trim()] = arrayContent.split(",").map(item => item.trim());
        } else {
          acc[key.trim()] = [];
        }
      } else {
        acc[key.trim()] = value;
      }
    }
    return acc;
  }, {} as Record<string, any>);
  
  return { frontMatter, content: contentWithoutFrontMatter };
}

// 递归读取目录中的所有Markdown文件
function getMarkdownFiles(dir: string): Array<{ file: string, mtime: Date }> {
  let results: Array<{ file: string, mtime: Date }> = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 递归处理子目录
      const subDirFiles = getMarkdownFiles(filePath);
      results = results.concat(subDirFiles);
    } else if (file.endsWith('.md')) {
      // 计算相对路径（相对于src/md目录）
      const relativePath = path.relative(path.join(process.cwd(), "src", "md"), filePath);
      results.push({
        file: relativePath,
        mtime: stats.mtime
      });
    }
  });
  
  return results;
}

// 从src/md目录读取Markdown文件内容
function getMarkdownContent(fileName: string): string {
  const markdownPath = path.join(process.cwd(), "src", "md", fileName);
  const content = fs.readFileSync(markdownPath, "utf8");
  const { content: contentWithoutFrontMatter } = parseFrontMatter(content);
  return contentWithoutFrontMatter;
}

// 生成文件目录树数据
function generateFileTree(dir: string, basePath: string = '', keyPrefix: string = ''): Array<{
  label: string;
  value: string;
  key: string;
  children?: Array<{
    label: string;
    value: string;
    key: string;
    children?: any[];
  }>;
}> {
  const tree: Array<{
    label: string;
    value: string;
    key: string;
    children?: any[];
  }> = [];
  
  const files = fs.readdirSync(dir);
  let keyIndex = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const relativePath = path.join(basePath, file);
    const currentKey = keyPrefix ? `${keyPrefix}-${keyIndex}` : `${keyIndex}`;
    
    if (stats.isDirectory()) {
      // 处理目录
      const directoryNode = {
        label: file,
        value: relativePath,
        key: currentKey,
        children: generateFileTree(filePath, relativePath, currentKey)
      };
      tree.push(directoryNode);
    } else if (file.endsWith('.md')) {
      // 处理Markdown文件
      const fileNode = {
        label: file.replace('.md', ''),
        value: relativePath,
        key: currentKey
      };
      tree.push(fileNode);
    }
    
    keyIndex++;
  });
  
  return tree;
}

// 自动读取src/md目录下的所有Markdown文件
function getArticles() {
  const mdDirectory = path.join(process.cwd(), "src", "md");
  
  // 递归获取所有Markdown文件并按修改时间倒序排序
  const mdFilesWithStats = getMarkdownFiles(mdDirectory)
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()); // 按修改时间倒序排序
  
  // 生成文章元数据
  return mdFilesWithStats.map(({ file }, index) => {
    // 从文件名中提取标题（移除.md后缀）
    let title = path.basename(file).replace('.md', '');
    
    // 从文件路径中提取分类信息（如子目录名或文件名中的前缀）
    let category = '其他';
    
    // 检查是否在子目录中
    const dirName = path.dirname(file);
    if (dirName !== '.') {
      // 使用子目录名作为分类
      category = path.basename(dirName);
    } else {
      // 从文件名中提取分类信息（如 "Java_基础.md" 中的 "Java"）
      const underscoreIndex = title.indexOf('_');
      if (underscoreIndex > 0) {
        category = title.substring(0, underscoreIndex);
        title = title.substring(underscoreIndex + 1);
      }
    }
    
    // 读取文件内容
    const markdownPath = path.join(process.cwd(), "src", "md", file);
    const fileContent = fs.readFileSync(markdownPath, "utf8");
    
    // 解析YAML front matter
    const { frontMatter, content } = parseFrontMatter(fileContent);
    
    // 优先使用YAML front matter中的数据
    const articleTitle = frontMatter.title || title;
    const articleDate = frontMatter.date || new Date().toISOString().split('T')[0];
    const articleSummary = frontMatter.description || generateSummary(content);
    const articleTags = frontMatter.tags || [];
    const articleCategory = frontMatter.category || category;
    
    return {
      id: index + 1,
      title: articleTitle,
      date: articleDate,
      summary: articleSummary,
      file,
      category: articleCategory,
      tags: articleTags
    };
  });
}

export default function Home() {
  // 在组件内部调用 getArticles()，确保每次构建时都能读取最新的文件
  const articles = getArticles();
  
  // 预加载所有Markdown内容
  const articleContents = articles.reduce((acc, article) => {
    acc[article.file] = getMarkdownContent(article.file);
    return acc;
  }, {} as Record<string, string>);
  
  // 生成默认图谱数据（所有文件）
  const allFilesGraphData = generateKnowledgeGraph();
  
  // 获取所有Markdown文件列表
  const fileList = getMarkdownFileList();
  
  // 预生成每个文件的图谱数据
  const fileGraphDataMap = new Map<string, any>();
  fileList.forEach(file => {
    const fullFilePath = path.join(process.cwd(), "src", "md", file);
    const fileGraphData = generateKnowledgeGraphForFile(fullFilePath);
    fileGraphDataMap.set(file, fileGraphData);
  });
  
  // 生成文件目录树数据
  const mdDirectory = path.join(process.cwd(), "src", "md");
  const fileTreeData = generateFileTree(mdDirectory);
  
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <main className="max-w-[1500px] mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            {/* <Image src="/next.svg" alt="Logo" width={100} height={20} /> */}
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
        
        <BlogContent 
          articles={articles} 
          articleContents={articleContents} 
          graphData={allFilesGraphData}
          fileList={fileList}
          fileGraphDataMap={Object.fromEntries(fileGraphDataMap)}
          fileTreeData={fileTreeData}
        />
      </main>
    </div>
  );
}

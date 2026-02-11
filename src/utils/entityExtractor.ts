import fs from "fs";
import path from "path";

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

// 实体类型定义
export interface Entity {
  id: string;
  label: string;
  type: string;
  occurrences: number;
  sources: string[];
}

// 关系类型定义
export interface Relationship {
  source: string;
  target: string;
  type: string;
  strength: number;
}

// 图谱数据类型定义
export interface GraphData {
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
}

// 从Markdown文件中提取技术术语的规则
const TECH_TERM_RULES = {
  // 框架和库：通常是大写开头的单词，可能包含连字符或点，且长度至少为2
  frameworks: /\b([A-Z][a-zA-Z0-9]{2,}(-[A-Z][a-zA-Z0-9]+)*)(\.[a-zA-Z0-9]+)?\b/g,
  // 概念：可能是中文词汇（长度至少为2）或英文术语（多个大写单词组成）
  concepts: /\b([\u4e00-\u9fa5]{2,}|[A-Z][a-zA-Z0-9]+(\s+[A-Z][a-zA-Z0-9]+){1,})\b/g,
  // 编程语言：通常是大写开头的单词，可能包含加号或井号，且长度至少为2
  languages: /\b([A-Z][a-zA-Z0-9]{2,}([+#][a-zA-Z0-9]*)?)\b/g,
  // 工具：通常是大写开头的单词，可能包含连字符，且长度至少为2
  tools: /\b([A-Z][a-zA-Z0-9]{2,}(-[A-Z][a-zA-Z0-9]+)+)\b/g,
  // 设计模式：通常是中文词汇，以"模式"结尾，且前面至少有2个汉字
  patterns: /\b([\u4e00-\u9fa5]{2,}模式)\b/g
};

// 递归读取目录中的所有Markdown文件
function getMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      const subDirFiles = getMarkdownFiles(filePath);
      results = results.concat(subDirFiles);
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });
  
  return results;
}

// 提取文件中的实体
function extractEntitiesFromFile(filePath: string): { entities: Entity[], relationships: Relationship[] } {
  const content = fs.readFileSync(filePath, "utf8");
  const { frontMatter, content: contentWithoutFrontMatter } = parseFrontMatter(content);
  
  // 合并所有内容用于分析
  const fullContent = `${frontMatter.title || ''} ${frontMatter.description || ''} ${contentWithoutFrontMatter}`;
  const fileName = path.basename(filePath);
  
  // 提取实体
  const entities: Entity[] = [];
  const entityMap = new Map<string, Entity>();
  
  // 遍历技术术语规则，使用正则表达式提取术语
  Object.entries(TECH_TERM_RULES).forEach(([type, regex]) => {
    // 重置正则表达式的lastIndex
    regex.lastIndex = 0;
    let match;
    
    // 查找所有匹配的术语
    while ((match = regex.exec(fullContent)) !== null) {
      const term = match[0];
      
      // 跳过单个字母的术语，避免抽取 C、R 等单个字母
      if (term.length <= 1) {
        continue;
      }
      
      // 跳过数字
      if (/^\d+$/.test(term)) {
        continue;
      }
      
      // 跳过常见的非技术词汇
      const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 'ought', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose', 'why', 'how', 'where', 'when'];
      if (commonWords.includes(term.toLowerCase())) {
        continue;
      }
      
      // 跳过单个字母的英文单词
      if (/^[a-zA-Z]$/.test(term)) {
        continue;
      }
      
      // 跳过纯数字和日期格式
      if (/^\d+(\.\d+)?$/.test(term) || /^\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2}$/.test(term)) {
        continue;
      }
      
      // 跳过邮箱地址和URL
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(term) || /^https?:\/\//.test(term)) {
        continue;
      }
      
      // 跳过文件路径和文件名
      if (/^([a-zA-Z]:)?(\\|\/)[^\\/]+(\\|\/)[^\\/]+$/.test(term) || /^[^\\/]+\.[a-zA-Z0-9]+$/.test(term)) {
        continue;
      }
      
      const id = term.toLowerCase().replace(/\s+/g, '-');
      if (entityMap.has(id)) {
        const entity = entityMap.get(id)!;
        entity.occurrences += 1;
        if (!entity.sources.includes(fileName)) {
          entity.sources.push(fileName);
        }
      } else {
        const entity: Entity = {
          id,
          label: term,
          type,
          occurrences: 1,
          sources: [fileName]
        };
        entityMap.set(id, entity);
        entities.push(entity);
      }
    }
  });
  
  // 提取关系（根据实体类型生成更有意义的关系类型）
  const relationships: Relationship[] = [];
  const entityIds = Array.from(entityMap.keys());
  
  // 创建实体ID到类型的映射
  const entityTypeMap = new Map<string, string>();
  entityMap.forEach((entity) => {
    entityTypeMap.set(entity.id, entity.type);
  });
  
  // 定义关系类型映射
  const relationshipTypes: Record<string, Record<string, string>> = {
    frameworks: {
      languages: "written-in",
      concepts: "uses",
      tools: "built-with",
      patterns: "implements",
      frameworks: "related-to"
    },
    concepts: {
      languages: "applied-in",
      concepts: "related-to",
      tools: "used-by",
      frameworks: "used-in",
      patterns: "related-to"
    },
    languages: {
      languages: "related-to",
      frameworks: "used-by",
      concepts: "supports",
      tools: "used-with",
      patterns: "implements"
    },
    tools: {
      languages: "works-with",
      frameworks: "builds",
      concepts: "supports",
      tools: "integrates-with",
      patterns: "supports"
    },
    patterns: {
      languages: "implemented-in",
      frameworks: "used-by",
      concepts: "related-to",
      tools: "used-with",
      patterns: "related-to"
    }
  };
  
  for (let i = 0; i < entityIds.length; i++) {
    for (let j = i + 1; j < entityIds.length; j++) {
      const sourceType = entityTypeMap.get(entityIds[i]);
      const targetType = entityTypeMap.get(entityIds[j]);
      
      // 生成关系类型
      let relationshipType = "related";
      if (sourceType && targetType && relationshipTypes[sourceType] && relationshipTypes[sourceType][targetType]) {
        relationshipType = relationshipTypes[sourceType][targetType];
      }
      
      relationships.push({
        source: entityIds[i],
        target: entityIds[j],
        type: relationshipType,
        strength: 1
      });
    }
  }
  
  return { entities, relationships };
}

// 生成知识图谱数据
export function generateKnowledgeGraph(): GraphData {
  const mdDirectory = path.join(process.cwd(), "src", "md");
  const markdownFiles = getMarkdownFiles(mdDirectory);
  
  // 收集所有实体和关系
  const allEntities: Entity[] = [];
  const allRelationships: Relationship[] = [];
  const entityMap = new Map<string, Entity>();
  const relationshipMap = new Map<string, Relationship>();
  
  // 处理每个文件
  markdownFiles.forEach(filePath => {
    const { entities, relationships } = extractEntitiesFromFile(filePath);
    
    // 合并实体
    entities.forEach(entity => {
      if (entityMap.has(entity.id)) {
        const existingEntity = entityMap.get(entity.id)!;
        existingEntity.occurrences += entity.occurrences;
        existingEntity.sources = [...new Set([...existingEntity.sources, ...entity.sources])];
      } else {
        entityMap.set(entity.id, entity);
        allEntities.push(entity);
      }
    });
    
    // 合并关系
    relationships.forEach(rel => {
      const key = `${rel.source}-${rel.target}`;
      if (relationshipMap.has(key)) {
        relationshipMap.get(key)!.strength += 1;
      } else {
        relationshipMap.set(key, rel);
        allRelationships.push(rel);
      }
    });
  });
  
  // 生成节点和链接
  const typeGroups = {
    frameworks: 1,
    concepts: 2,
    languages: 3,
    tools: 4,
    patterns: 5
  };
  
  const nodes = allEntities.map(entity => ({
    id: entity.id,
    label: entity.label,
    group: typeGroups[entity.type as keyof typeof typeGroups] || 0,
    size: Math.min(entity.occurrences * 2, 20) // 限制最大尺寸
  }));
  
  const links = allRelationships.map(rel => ({
    source: rel.source,
    target: rel.target,
    value: rel.strength,
    label: rel.type
  }));

  
  return { nodes, links };
}

// 为单个文件生成知识图谱数据
export function generateKnowledgeGraphForFile(filePath: string): GraphData {
  // 验证文件是否存在且是Markdown文件
  if (!fs.existsSync(filePath) || !filePath.endsWith('.md')) {
    return { nodes: [], links: [] };
  }
  
  // 提取文件中的实体和关系
  const { entities, relationships } = extractEntitiesFromFile(filePath);
  
  // 生成节点和链接
  const typeGroups = {
    frameworks: 1,
    concepts: 2,
    languages: 3,
    tools: 4,
    patterns: 5
  };
  
  const nodes = entities.map(entity => ({
    id: entity.id,
    label: entity.label,
    group: typeGroups[entity.type as keyof typeof typeGroups] || 0,
    size: Math.min(entity.occurrences * 2, 20) // 限制最大尺寸
  }));
  
  const links = relationships.map(rel => ({
    source: rel.source,
    target: rel.target,
    value: rel.strength,
    label: rel.type
  }));

  
  return { nodes, links };
}

// 获取所有Markdown文件列表
export function getMarkdownFileList(): string[] {
  const mdDirectory = path.join(process.cwd(), "src", "md");
  const markdownFiles = getMarkdownFiles(mdDirectory);
  
  // 转换为相对路径
  return markdownFiles.map(filePath => {
    return path.relative(mdDirectory, filePath);
  });
}

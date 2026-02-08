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

// 技术术语库
const TECH_TERMS = {
  frameworks: [
    "qiankun",
    "React", "Vue", "Angular", "Next.js", "Nuxt.js", "Svelte", "Gatsby",
    "Express", "Koa", "NestJS", "Fastify", "Flutter", "React Native",
    "Spring", "Django", "Flask", "Laravel", "Rails", "ASP.NET", "Symfony",
    "Meteor", "Ember.js", "Backbone.js", "Preact", "Inferno", "Solid.js",
    "Ionic", "NativeScript", "Xamarin", "Unity", "Unreal Engine"
  ],
  concepts: [
    "组件", "状态管理", "Props", "Hooks", "Ref", "Proxy", "defineProperty",
    "虚拟DOM", "Fiber", "JSX", "Redux", "Context API", "useState", "useEffect",
    "useContext", "useReducer", "useCallback", "useMemo", "useRef", "useLayoutEffect",
    "自定义Hook", "高阶组件", "Render Props", "Error Boundary", "Portal",
    "Suspense", "Concurrent Mode", "Server Components", "Code Splitting", "Lazy Loading",
    "Tree Shaking", "Hot Module Replacement", "Server-Side Rendering", "Static Site Generation",
    "Incremental Static Regeneration", "Progressive Web App", "Single Page Application",
    "Multi Page Application", "Micro Frontends", "BFF Pattern", "API Gateway",
    "Circuit Breaker", "Rate Limiting", "CORS", "CSRF", "XSS", "SQL Injection",
    "Authentication", "Authorization", "Session Management", "JWT", "OAuth", "OpenID Connect"
  ],
  languages: [
    "JavaScript", "TypeScript", "Java", "Python", "C++", "C#", "Go", "Rust",
    "PHP", "Ruby", "Swift", "Kotlin", "Dart", "HTML", "CSS", "SCSS", "Less",
    "C", "Objective-C", "Perl", "Shell", "PowerShell", "R", "Matlab", "Scala",
    "Groovy", "Clojure", "Haskell", "Erlang", "Elixir", "Lua", "Julia", "Crystal",
    "Zig", "WebAssembly", "XML", "JSON", "YAML", "TOML", "Markdown", "GraphQL",
    "SQL", "NoSQL", "MongoDB Query Language", "Redis Commands"
  ],
  tools: [
    "Webpack", "Vite", "Rollup", "Babel", "ESLint", "Prettier", "Jest",
    "Testing Library", "Cypress", "Playwright", "Docker", "Git", "npm", "yarn", "pnpm",
    "ESBuild", "SWC", "Parcel", "Turborepo", "Lerna", "NX", "Rush",
    "Mocha", "Chai", "Sinon", "Jasmine", "Karma", "AVA", "Tap", "QUnit",
    "Storybook", "Lerna", "NX", "Rush", "Docker Compose", "Kubernetes", "Minikube",
    "Kind", "Helm", "Terraform", "Ansible", "Chef", "Puppet", "SaltStack",
    "Jenkins", "Travis CI", "CircleCI", "GitHub Actions", "GitLab CI", "Bitbucket Pipelines",
    "AWS CodePipeline", "Azure DevOps", "Google Cloud Build", "SonarQube", "Snyk",
    "Datadog", "New Relic", "Prometheus", "Grafana", "ELK Stack", "Loki", "Jaeger", "Zipkin"
  ],
  patterns: [
    "单例模式", "工厂模式", "观察者模式", "发布订阅模式", "装饰器模式",
    "适配器模式", "策略模式", "模板方法模式", "责任链模式", "命令模式",
    "原型模式", "建造者模式", "抽象工厂模式", "桥接模式", "组合模式",
    "外观模式", "享元模式", "中介者模式", "备忘录模式", "状态模式",
    "访问者模式", "解释器模式", "迭代器模式", "空对象模式", "代理模式",
    "依赖注入", "控制反转", "面向切面编程", "领域驱动设计", "事件溯源",
    "CQRS", "微服务架构", "单体架构", "分层架构", "六边形架构",
    "洋葱架构", "清洁架构", "管道过滤器模式", "主从模式", "领导者跟随者模式"
  ]
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
  
  // 转义正则表达式中的特殊字符
  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // 遍历技术术语库，查找匹配的实体
      Object.entries(TECH_TERMS).forEach(([type, terms]) => {
        terms.forEach(term => {
          // 跳过单个字母的术语，避免抽取 C、R 等单个字母
          if (term.length <= 1) {
            return;
          }
          
          const escapedTerm = escapeRegExp(term);
          // 使用单词边界确保只匹配完整的单词
          const regex = new RegExp(`\\b(${escapedTerm})\\b`, 'gi');
          const matches = fullContent.match(regex);
          
          if (matches) {
            const id = term.toLowerCase().replace(/\s+/g, '-');
            if (entityMap.has(id)) {
              const entity = entityMap.get(id)!;
              entity.occurrences += matches.length;
              if (!entity.sources.includes(fileName)) {
                entity.sources.push(fileName);
              }
            } else {
              const entity: Entity = {
                id,
                label: term,
                type,
                occurrences: matches.length,
                sources: [fileName]
              };
              entityMap.set(id, entity);
              entities.push(entity);
            }
          }
        });
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

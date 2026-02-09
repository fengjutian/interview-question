# Markdown 博客与知识图谱应用

这是一个基于 [Next.js](https://nextjs.org) 和 [Electron](https://www.electronjs.org) 构建的 Markdown 博客应用，支持自动读取 Markdown 文件、实时渲染、搜索高亮、暗色主题、知识图谱可视化等功能。

## 功能特性

- 📁 **自动文件读取**：自动读取 `src/md` 目录下的所有 Markdown 文件
- 📅 **按修改时间排序**：文章列表按文件修改时间倒序排列
- 🔄 **实时内容刷新**：使用 `dynamic = 'force-dynamic'` 实现实时内容刷新
- 📝 **智能摘要生成**：自动为每篇文章生成摘要
- 🌓 **暗色主题**：支持浅色/深色/跟随系统三种主题模式
- 🔍 **搜索功能**：支持文章内容搜索和高亮显示
- 🎨 **响应式布局**：适配不同屏幕尺寸
- 💅 **美观的 UI**：使用 Semi Design 和 Tailwind CSS 构建
- 📱 **浮动按钮**：右下角浮动 AI 编辑和知识图谱按钮
- 📖 **侧边栏**：点击设置图标显示主题设置侧边栏
- 🖥️ **Electron 支持**：可作为桌面应用运行，支持本地文件系统操作
- 📁 **文件目录树**：左侧显示文件目录结构，支持点击文件查看内容
- 🔗 **知识图谱**：自动抽取文章中的技术实体，生成交互式知识图谱
- 📝 **文件操作**：支持添加、删除、重命名文件和文件夹

## 技术栈

- **前端框架**：Next.js 16.1.5 (Turbopack)
- **桌面应用**：Electron
- **UI 库**：Semi Design
- **样式**：Tailwind CSS
- **Markdown 渲染**：React Markdown
- **语法高亮**：rehype-highlight
- **状态管理**：React useState
- **文件系统**：Node.js fs 模块 + Electron IPC
- **知识图谱**：自定义实体抽取算法

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 启动 Electron 应用

```bash
npm run electron:dev
# 或
yarn electron:dev
# 或
pnpm electron:dev
```

### 添加文章

1. 在 `src/md` 目录下创建 Markdown 文件
2. 文件会自动被应用检测到并添加到文章列表中
3. 文章标题会使用文件名（移除 .md 后缀）

### 主题设置

- 点击顶部的月亮/太阳图标快速切换浅色/深色模式
- 点击设置图标打开侧边栏，选择具体的主题模式
- 支持 "浅色"、"深色" 和 "跟随系统" 三种模式

### 搜索功能

- 在左侧内容区域的搜索框中输入关键词
- 搜索结果会在文章内容中高亮显示

### 知识图谱

- 点击右下角的知识图谱图标打开知识图谱侧边栏
- 知识图谱会显示文章中提取的技术实体和它们之间的关系
- 可以通过点击节点查看相关实体

## 项目结构

```
interview-question/
├── src/
│   ├── app/
│   │   ├── BlogContent.tsx        # 博客内容组件
│   │   ├── SettingsClient.tsx     # 设置客户端组件
│   │   ├── globals.css            # 全局样式
│   │   ├── layout.tsx             # 应用布局
│   │   └── page.tsx               # 主页面
│   ├── components/
│   │   ├── MarkdownRenderer.tsx   # Markdown 渲染组件
│   │   └── FileTree.tsx           # 文件目录树组件
│   ├── md/                        # Markdown 文章目录
│   │   └── *.md                   # 博客文章
│   └── utils/
│       ├── summary.ts             # 摘要生成工具
│       └── entityExtractor.ts     # 实体抽取和知识图谱生成工具
├── electron/
│   ├── main.ts                    # Electron 主进程
│   └── preload.js                 # Electron 预加载脚本
├── README.md                      # 项目说明
└── package.json                   # 项目配置
```

## 部署

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 启动生产服务器

```bash
npm start
# 或
yarn start
# 或
pnpm start
```

### 构建 Electron 应用

```bash
npm run electron:build
# 或
yarn electron:build
# 或
pnpm electron:build
```

## 注意事项

- 确保 `src/md` 目录存在且包含 Markdown 文件
- 文章内容会自动按修改时间排序
- 主题设置会保存到本地存储，下次打开应用时会保持上次的设置
- 搜索功能仅在当前显示的文章中生效
- 在 Electron 模式下，应用具有完整的文件系统访问权限

## 许可证

MIT

# Next.js 入门指南

## 什么是 Next.js？

Next.js 是一个基于 React 的前端框架，用于构建服务器端渲染 (SSR) 和静态网站生成 (SSG) 的应用程序。它由 Vercel 公司开发和维护，提供了许多开箱即用的功能，使 React 应用程序的开发变得更加简单和高效。

## 主要特性

### 1. 服务器端渲染 (SSR)

Next.js 支持服务器端渲染，这意味着页面在服务器上生成 HTML，然后发送到客户端。这可以提高首屏加载速度，改善 SEO 表现。

### 2. 静态网站生成 (SSG)

Next.js 支持静态网站生成，这意味着页面在构建时生成 HTML，可以直接部署到任何静态托管服务上。这提供了最佳的性能和安全性。

### 3. 自动代码分割

Next.js 会自动将代码分割成小块，只加载当前页面所需的代码，减少了初始加载时间。

### 4. 路由系统

Next.js 提供了基于文件系统的路由系统，无需配置，简单直观。

### 5. API 路由

Next.js 允许在同一代码库中创建 API 端点，使前后端代码可以放在一起。

## 快速开始

### 1. 创建新的 Next.js 项目

```bash
npx create-next-app@latest
```

### 2. 启动开发服务器

```bash
cd your-project-name
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构

Next.js 项目的典型结构如下：

```
your-project-name/
├── app/            # App Router (Next.js 13+)
├── pages/          # Pages Router
├── public/         # 静态资源
├── components/     # React 组件
├── styles/         # 样式文件
├── lib/            # 工具函数
├── node_modules/
├── package.json
└── README.md
```

## 页面路由

在 Next.js 中，页面路由是基于文件系统的。在 `app` 目录（Next.js 13+）中创建文件，即可自动生成对应的路由。

例如：
- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/blog/[id]/page.tsx` → `/blog/1` (动态路由)

## 数据获取

Next.js 提供了多种数据获取方法：

### 1. Server Components (Next.js 13+)

在 App Router 中，组件默认是服务器组件，可以直接在组件中获取数据。

```tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();
  
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 2. getStaticProps (Pages Router)

用于静态网站生成，在构建时获取数据。

### 3. getServerSideProps (Pages Router)

用于服务器端渲染，在每个请求时获取数据。

## 部署

Next.js 应用程序可以部署到各种平台：

### 1. Vercel

Vercel 是 Next.js 的官方托管平台，提供了最佳的开发和部署体验。

### 2. 其他平台

Next.js 应用程序也可以部署到 Netlify、AWS、Google Cloud 等平台。

## 总结

Next.js 是一个功能强大的前端框架，提供了许多开箱即用的功能，使 React 应用程序的开发变得更加简单和高效。它支持服务器端渲染、静态网站生成、自动代码分割等特性，可以满足各种应用场景的需求。

如果你正在寻找一个现代化的前端框架，Next.js 绝对值得一试！
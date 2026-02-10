---
title: React 中的 Suspense 作用是什么？
tags: [React, Suspense]
description: React 中的 Suspense 作用是什么？
date: 2026-02-10
category: React
---

在 **React** 中，`Suspense` 的作用可以总结为一句话：

> **在异步加载的组件（或资源）还没准备好时，展示一个“占位 UI”，等加载完成再渲染实际内容。**

它最常用于 **懒加载组件** (`React.lazy`) 或 **Concurrent Mode 下的异步数据加载**。

---

## 1️⃣ 基本用法：懒加载组件

```tsx
import React, { Suspense, lazy } from 'react';

const Home = lazy(() => import('./Home')); // 懒加载 Home 组件

export default function App() {
  return (
    <div>
      <h1>我的应用</h1>
      <Suspense fallback={<div>加载中...</div>}>
        <Home />
      </Suspense>
    </div>
  );
}
```

解释：

* `lazy()`：让组件在真正需要时才加载。
* `Suspense`：包裹懒加载组件，`fallback` 是加载时显示的占位 UI。
* 当 `Home` 组件还没加载完时，显示 `<div>加载中...</div>`；加载完成后渲染实际的 `<Home />`。

---

## 2️⃣ 优点

1. **提升首屏加载速度**：不需要一次性加载所有页面和组件。
2. **改善用户体验**：异步内容可以显示加载状态。
3. **可组合性**：可以嵌套多个 `Suspense`，对不同组件显示不同的 fallback。

---

## 3️⃣ 嵌套 Suspense 示例

```tsx
const Header = lazy(() => import('./Header'));
const Content = lazy(() => import('./Content'));

export default function App() {
  return (
    <Suspense fallback={<div>整体加载中...</div>}>
      <Suspense fallback={<div>加载 Header...</div>}>
        <Header />
      </Suspense>
      <Suspense fallback={<div>加载 Content...</div>}>
        <Content />
      </Suspense>
    </Suspense>
  );
}
```

✅ 效果：

* Header 加载慢时显示 “加载 Header...”
* Content 加载慢时显示 “加载 Content...”
* 所有都加载完成后显示完整页面。

---

## 4️⃣ 未来用途：数据 Suspense

在 React **Concurrent Mode** 下，`Suspense` 还能用于异步数据加载：

```tsx
function Profile() {
  const user = fetchUser(); // fetchUser 返回的是一个可 Suspense 的资源
  return <div>{user.name}</div>;
}

<Suspense fallback={<div>加载用户信息...</div>}>
  <Profile />
</Suspense>
```

也就是说，`Suspense` 不仅限于组件懒加载，还可以处理异步数据，让 UI 在等待资源时更优雅。

---

简单总结：

| 特性                  | 说明                    |
| ------------------- | --------------------- |
| **lazy + Suspense** | 按需加载组件，显示占位 UI        |
| **嵌套 Suspense**     | 针对不同区域显示不同加载状态        |
| **未来数据 Suspense**   | 异步数据加载时，自动展示 fallback |



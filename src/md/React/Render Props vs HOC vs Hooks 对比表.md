---
title: Render Props vs HOC vs Hooks 对比表
category: React
tags: [React, Render Props, HOC, Hooks]
description: Render Props、HOC、Hooks 都是 React 中用于逻辑复用的模式。对比表展示了它们的出现时间、逻辑复用方式、复用粒度、是否产生额外组件、是否修改组件结构、是否有嵌套地狱、是否有命名冲突、是否支持多个复用逻辑、类型推导（TS）、性能、现在是否推荐。
date: 2026-02-11
---


---

# 🔥 Render Props vs HOC vs Hooks 面试对比表

| 对比维度       | Render Props   | HOC             | Hooks      |
| ---------- | -------------- | --------------- | ---------- |
| 出现时间       | React 16 之前流行  | React 15+       | React 16.8 |
| 逻辑复用方式     | 通过 children 函数 | 通过组件包装          | 通过函数       |
| 复用粒度       | 组件级            | 组件级             | 函数级        |
| 是否产生额外组件   | 会              | 会               | 不会         |
| 是否修改组件结构   | 不修改            | 包装一层            | 不修改        |
| 是否有嵌套地狱    | 容易有            | 容易有             | 基本没有       |
| 是否有命名冲突    | 不会             | 容易有             | 不会         |
| 是否支持多个复用逻辑 | 嵌套             | 多层包装            | 直接多次调用     |
| 类型推导（TS）   | 一般             | 较复杂             | 最好         |
| 性能         | 可能频繁重新渲染       | 可能 props 透传影响性能 | 最优（无额外组件）  |
| 现在是否推荐     | 不推荐新项目         | 不推荐新项目          | 推荐         |

---

# 🧠 三种模式核心思想对比

## 1️⃣ Render Props

本质：

> 把“渲染权”交给调用者

```jsx
<DataProvider>
  {(data) => <UI data={data} />}
</DataProvider>
```

问题：

* JSX 嵌套地狱
* 每次 render 都是新函数
* 结构不清晰

---

## 2️⃣ HOC（高阶组件）

本质：

> 函数返回增强后的组件

```jsx
function withAuth(Component) {
  return function Wrapper(props) {
    return isLogin ? <Component {...props} /> : <Login />;
  };
}
```

问题：

* Wrapper Hell
* displayName 丢失
* ref 透传麻烦
* props 冲突

---

## 3️⃣ Hooks

本质：

> 把组件逻辑抽成函数

```jsx
function useAuth() {
  const [user, setUser] = useState(null);
  return user;
}
```

使用：

```jsx
function App() {
  const user = useAuth();
}
```

优点：

* 没有嵌套
* 没有组件层级增加
* 逻辑更直观
* TS 支持最好

---

# 🔥 面试高分回答版本

如果面试官问：

> 三者有什么区别？

你可以这样答：

> Render Props 和 HOC 都是组件级逻辑复用方案，会产生额外组件层级；
> Hooks 是函数级逻辑复用，不会改变组件结构，是更底层、更简洁的方案。
> Hooks 解决了 HOC 的嵌套地狱、命名冲突、ref 透传问题，也解决了 Render Props 的 JSX 嵌套问题。
> 所以现代 React 项目优先使用 Hooks。

---

# 🔥 面试官追问点（一定会问）

---

## 追问1：Hooks 是不是完全可以替代 HOC？

标准答案：

> 业务逻辑复用可以替代，但组件增强场景（比如 ErrorBoundary、React.memo）仍然用 HOC。

---

## 追问2：为什么 Hooks 更底层？

因为：

* 它不依赖组件包装
* 它直接操作函数组件执行机制
* 它基于 React Fiber 的 Hook 链表实现

---

## 追问3：Hooks 有什么限制？

* 只能在函数组件顶层调用
* 不能在条件/循环里调用
* 依赖调用顺序

---

## 追问4：Render Props 为什么性能不好？

因为：

```jsx
<Data>
  {data => <UI data={data} />}
</Data>
```

每次 render 都创建新函数
会导致 PureComponent 失效

---

# 🔥 架构级理解（进阶）

演进路线：

```
Mixins  →  HOC  →  Render Props  →  Hooks
```

趋势：

> 从“组件复用”走向“逻辑复用”

这是 React 架构思想升级。

---

# 🎯 一句话总结

* HOC = 包装组件
* Render Props = 控制渲染
* Hooks = 复用逻辑
* 现代 React = Hooks 优先

---

如果你愿意，我可以给你：

* 🔥 一道“面试官连续追问”模拟
* 🔥 Hooks 原理源码级讲解
* 🔥 手写一个 mini Hook 系统
* 🔥 为什么 Hooks 必须按顺序调用（底层机制）

你想往哪种深度继续？

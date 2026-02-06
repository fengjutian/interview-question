---
title: React的Fiber架构
category: React
tags: [React, Fiber, 架构]
description: 详细解释React的Fiber架构，包括工作单元拆分、优先级调度、双缓存和副作用链表等核心特点
date: 2026-02-05
---

## 详细解释React的Fiber架构

Fiber是React 16引入的新协调引擎，主要解决React在进行大量渲染时可能阻塞主线程的问题。
核心特点：

- **工作单元拆分**：将渲染工作分割成小单元，每个单元可以被中断
- **优先级调度**：不同更新赋予不同优先级，紧急任务可以插队
- **双缓存**：构建两棵树（current树和workInProgress树）实现高效更新
- **副作用链表**：记录需要执行的DOM操作，统一处理

Fiber实现了"可中断渲染"与"优先级排序"，使React应用在处理大量数据时保持响应性。

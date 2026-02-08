---
title: 10 道 Redux 必挂面试题
tags: [React, Redux, 状态管理]
description: 关于 Redux 必挂面试题的详细介绍，包括定义、用途和实现方法
date: 2026-02-08
category: React
---

## ① Redux 和 React 有什么关系？

**标准回答：**
Redux 和 React **没有强依赖关系**。Redux 是一个**通用的状态管理库**，可以配合 React、Vue，甚至原生 JS 使用。
React-Redux 只是官方提供的**绑定层**，用于让 React 组件更方便地使用 Redux。

👉 **加分点：**

> Redux 关注状态管理，React 关注 UI 渲染，职责是分离的。

---

## ② Redux 为什么只有一个 Store？

**标准回答：**
单一 Store 可以保证：

* 状态集中管理
* 数据流清晰可追踪
* 方便 DevTools 做时间旅行调试

如果有多个 Store，就会出现状态同步和依赖混乱的问题。

👉 **一句话总结：**

> 一个 Store 是为了保证全局状态的可预测性。

---

## ③ 为什么 Redux 要求 reducer 是纯函数？

**标准回答：**
因为 Redux 需要保证：

* 相同的 `state + action` 得到相同结果
* 支持时间回溯和状态回放
* 方便测试和调试

如果 reducer 有副作用（如请求接口、修改外部变量），这些能力都会失效。

---

## ④ Redux 中为什么不能直接修改 state？

**标准回答：**
直接修改 state 会：

* 破坏不可变数据原则
* 导致引用不变，React 无法触发更新
* 污染历史状态，影响调试

Redux 通过**返回新的 state 对象**，配合浅比较来判断是否更新。

👉 **关键词：** 引用变化、浅比较、性能优化

---

## ⑤ Redux 为什么是单向数据流？

**标准回答：**
单向数据流可以：

* 明确状态变化的来源
* 避免数据双向绑定导致的不可控更新
* 让状态变化路径清晰、可追踪

流程是：

```
View → dispatch → reducer → newState → View
```

---

## ⑥ Redux 本身为什么不支持异步？

**标准回答：**
Redux 的设计理念是：

> **state 的变化必须是同步、可预测的**

异步逻辑本身不可预测，所以被抽离到 middleware（如 thunk、saga）中处理，而不是放在 reducer 里。

---

## ⑦ redux-thunk 的核心原理是什么？

**标准回答：**
redux-thunk 本质是一个 middleware，它做了两件事：

1. 判断 dispatch 的是不是函数
2. 如果是函数，就执行它并注入 `dispatch` 和 `getState`

否则就当普通 action 继续传递。

👉 **一句话总结：**

> thunk 让 dispatch 支持函数，从而实现异步。

---

## ⑧ Redux 中 middleware 是做什么的？

**标准回答：**
middleware 位于 **dispatch 和 reducer 之间**，用于：

* 处理异步逻辑
* 拦截和增强 action
* 记录日志、错误处理等

本质是对 `dispatch` 的函数式包装。

---

## ⑨ React-Redux 是如何触发组件更新的？

**标准回答：**
React-Redux 内部：

1. 通过 `subscribe` 监听 store 变化
2. state 变化后执行 selector
3. 对比新旧 selector 结果
4. 变化则触发组件重新渲染

默认使用 **引用相等（===）** 判断。

👉 **追问防挂点：**

> useSelector 返回新对象一定会导致重新渲染。

---

## ⑩ Redux Toolkit 为什么可以“直接修改 state”？

**标准回答：**
Redux Toolkit 内部使用了 **Immer**。
开发时写的是“可变逻辑”，但 Immer 会在底层通过 **Proxy + Copy-on-write** 生成不可变的新 state。

所以：

```js
state.count++
```

本质上仍然是返回了新对象。

---

## 面试官视角总结（你这样答=稳）

如果你能自然说出这些关键词👇

* 单向数据流
* 不可变数据
* 纯函数
* middleware
* 引用比较
* thunk 原理
* Immer

👉 **基本可以判定你不是“只会用”的人**。

---

如果你想继续进阶，我可以下一步直接给你：

* 🔥 **Redux 3 道“源码级追问”现场示范回答**
* 🔥 **手写 redux / thunk（面试白板级）**
* 🔥 **Redux vs Vuex / Pinia 高频对比题**
* 🔥 **Redux Toolkit 面试最容易被问崩的 5 点**

你准备的是 **社招几年经验**？我可以按 JD 再给你“狙击题”。

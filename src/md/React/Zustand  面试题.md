---
title: Zustand 面试题
category: React
tags: [React, Zustand, 状态管理]
description: Zustand 状态管理库的面试题，包括核心概念、工作流程和使用方法
date: 2026-02-09
---

# 一、Zustand 是什么？（开场题）

**Zustand 是一个轻量级的 React 状态管理库**

核心特点一句话版：

> **基于 hooks、去中心化、无 Provider、按需订阅、最小心智负担**

关键词命中率很高 👇

* 无 Provider
* 单 store / 多 store 都行
* 组件只订阅用到的 state
* 不强制 immutable（但支持）

---

# 二、Zustand vs Redux（必问）

| 对比项        | Zustand   | Redux      |
| ---------- | --------- | ---------- |
| 心智负担       | 低         | 高          |
| 模板代码       | 极少        | 非常多        |
| Provider   | 不需要       | 必须         |
| 中间件        | 内置        | 需额外配置      |
| 更新粒度       | **按字段订阅** | 默认整个 slice |
| 是否 Hook 风格 | ✅         | ❌（RTK 才像）  |

**标准回答**：

> Redux 更适合复杂业务和跨团队规范，Zustand 更适合中小型项目或对开发效率要求高的场景。

---

# 三、Zustand 的基本用法（必写）

```js
import { create } from 'zustand'

const useStore = create(set => ({
  count: 0,
  inc: () => set(state => ({ count: state.count + 1 })),
  dec: () => set(state => ({ count: state.count - 1 })),
}))
```

组件中使用：

```jsx
const count = useStore(state => state.count)
const inc = useStore(state => state.inc)
```

👉 **面试加分点**：

> selector 决定了组件的订阅粒度

---

# 四、Zustand 为什么不需要 Provider？

**核心原因：store 是一个独立存在的 JS 对象**

```txt
store 在模块作用域
组件只是通过 hook 订阅
```

不像 Redux：

* Provider 注入 context
* context value 变化 → 触发订阅

👉 Zustand 用的是 **发布-订阅模型**

---

# 五、Zustand 如何做到“只更新用到的组件”？（高频）

```js
useStore(state => state.count)
```

**关键点**：

* 每个 selector 都是一个独立订阅
* 内部通过 `Object.is` 比较前后值
* selector 返回值不变 → 组件不 rerender

❌ 错误用法（会导致无效渲染）：

```js
useStore(state => ({ count: state.count }))
```

✔ 正确：

```js
useStore(state => state.count)
```

---

# 六、Zustand 的 set 是同步还是异步？

> **set 是同步的，但 React 更新是异步调度的**

```js
set({ count: 1 })
console.log(get().count) // ✅ 立刻是 1
```

这是 Zustand 和 Redux 一个很大的差异点。

---

# 七、Zustand 状态是不可变的吗？

> **Zustand 不强制不可变，但推荐不可变**

```js
// 推荐
set(state => ({ list: [...state.list, item] }))
```

```js
// ❌ 会导致订阅失效
state.list.push(item)
```

可配合 `immer`：

```js
import { immer } from 'zustand/middleware/immer'

create(
  immer(set => ({
    list: [],
    add: item => set(state => {
      state.list.push(item)
    })
  }))
)
```

---

# 八、Zustand 中间件（必背）

### 1️⃣ persist（本地存储）

```js
import { persist } from 'zustand/middleware'

create(
  persist(
    set => ({
      token: '',
      setToken: token => set({ token }),
    }),
    { name: 'auth-store' }
  )
)
```

追问点：

* localStorage / sessionStorage
* hydration 问题（SSR）

---

### 2️⃣ devtools

```js
import { devtools } from 'zustand/middleware'

create(
  devtools(set => ({
    count: 0,
    inc: () => set(state => ({ count: state.count + 1 }))
  }))
)
```

---

### 3️⃣ subscribeWithSelector（高级）

```js
useStore.subscribe(
  state => state.count,
  (count, prev) => {
    console.log(count, prev)
  }
)
```

---

# 九、Zustand 能不能拆 store？（常问）

✅ 可以，**而且推荐**

```js
export const useUserStore = create(...)
export const useOrderStore = create(...)
```

好处：

* 避免大 store
* 减少无关订阅
* 逻辑清晰

---

# 十、Zustand 如何处理异步？

```js
const useStore = create(set => ({
  data: null,
  fetchData: async () => {
    const res = await fetch('/api')
    set({ data: await res.json() })
  }
}))
```

👉 不需要 thunk / saga
👉 action 就是普通 async 函数

---

# 十一、Zustand vs React Context（必问）

| 对比   | Zustand | Context |
| ---- | ------- | ------- |
| 更新粒度 | 精确      | 粗       |
| 性能   | 高       | 容易重渲染   |
| 心智负担 | 低       | 中       |
| 适合场景 | 状态管理    | 依赖注入    |

**一句话总结**：

> Context 不适合高频更新状态。

---

# 十二、Zustand 的坑（真实项目）

1. selector 返回新对象
2. 大对象直接订阅
3. SSR 下 persist hydration 不一致
4. store 间循环依赖
5. 在非 React 文件滥用 get()

---

# 十三、终极追问（高级）

### Q：Zustand 和 Redux 的核心差异？

**答法模板**：

> Redux 是“集中式 + 不可变 + reducer 驱动”，
> Zustand 是“去中心化 + 订阅驱动 + 函数式 set”。

---

### Q：Zustand 底层原理？

> 本质是一个 **可订阅的外部 store**，
> React 通过 `useSyncExternalStore` 对接更新。

（这句一出，面试官基本点头 😎）

---

如果你要**更狠一点**，我还能继续帮你：

* 🔥 Zustand **源码级解析**
* 🧠 Zustand vs Jotai / Recoil / Valtio
* 🧪 Zustand 测试方案
* 🧩 用 Zustand 实现一个 mini Redux
* 🏗 Zustand 在大型项目的拆分 & 规范

你是准备 **面试突击**，还是想做 **技术深度型选手**？

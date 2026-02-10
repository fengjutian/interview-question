---
title: React 自定义 Hooks 面试题
category: React
tags: [React, 自定义 Hooks, 状态管理]
description: React 自定义 Hooks 的面试题，包括核心概念、工作流程和使用方法
date: 2026-02-09
---

## 一、什么是 React 自定义 Hooks？

**自定义 Hook = 把可复用的逻辑抽成函数**
本质就是一个 **以 `use` 开头的普通函数**，内部可以使用 React 的内置 Hooks。

```js
function useSomething() {
  const [state, setState] = useState()
  useEffect(() => {})
  return ...
}
```

✔ 解决的是：**逻辑复用问题，而不是 UI 复用**

---

## 二、为什么要用自定义 Hooks？

### 1️⃣ 解决 HOC / Render Props 的问题

老方案的问题：

* 嵌套地狱
* props 冲突
* 调试困难
* 心智负担大

自定义 Hook：

* **无额外组件层级**
* **逻辑更直观**
* 组合自由

---

### 2️⃣ 让组件“变薄”

```jsx
// ❌ 逻辑又多又乱
function Page() {
  useEffect(...)
  useEffect(...)
  const handleScroll = ...
}
```

```jsx
// ✅ 组件只管“用”
function Page() {
  const { data, loading } = useFetch()
  const { x, y } = useScroll()
}
```

---

## 三、自定义 Hook 的基本规则（面试必考）

### ❗ Hooks 的两大铁律

1. **只能在函数组件或自定义 Hook 中调用**
2. **只能在最外层调用（不能 if / for）**

所以：

```js
// ❌ 错误
if (xx) {
  useEffect()
}
```

---

### ❗ 为什么名字必须以 `use` 开头？

* React 靠命名规则识别 Hooks
* ESLint Hooks 规则依赖 `useXxx`

```js
// ❌ 不会被当成 Hook
function fetchData() {}
```

```js
// ✅
function useFetch() {}
```

---

## 四、一个标准的自定义 Hook 模板

```js
import { useState, useEffect } from 'react'

export function useDemo(params) {
  const [state, setState] = useState(null)

  useEffect(() => {
    // 副作用
    return () => {
      // 清理
    }
  }, [params])

  const action = () => {}

  return {
    state,
    action,
  }
}
```

👉 **返回值建议用对象，而不是数组**（可读性更好）

---

## 五、常见 & 高频自定义 Hook 示例

### 1️⃣ useFetch（面试最爱）

```js
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetch(url)
      .then(res => res.json())
      .then(res => {
        if (!cancelled) setData(res)
      })
      .catch(err => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return { data, loading, error }
}
```

👉 追问点：**为什么要 cancelled？**

* 防止组件卸载后 setState

---

### 2️⃣ useDebounce

```js
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
```

---

### 3️⃣ usePrevious（非常加分）

```js
function usePrevious(value) {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
```

---

### 4️⃣ useEventListener（真实项目很常见）

```js
function useEventListener(event, handler) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => {
      window.removeEventListener(event, handler)
    }
  }, [event, handler])
}
```

👉 可追问：**handler 每次变怎么办？**
👉 可升级到 `useRef + useCallback`

---

## 六、自定义 Hook 的设计原则（高级）

### ✅ 1. 单一职责

一个 Hook 只做一件事

❌ useUserAndOrderAndScroll
✅ useUser / useOrder / useScroll

---

### ✅ 2. 可组合

```js
function useUserInfo() {
  const token = useToken()
  return useFetch(`/api/user?token=${token}`)
}
```

---

### ✅ 3. 不直接依赖 UI

❌ 在 Hook 里操作 DOM 样式
❌ 返回 JSX

✔ Hook 只返回 **状态 + 行为**

---

### ✅ 4. 避免“过度抽象”

* 只用一次的逻辑，不一定要抽 Hook
* 抽了反而更难读

---

## 七、面试官常见追问（你可以这样答）

### Q1：自定义 Hook 和普通函数的区别？

> 自定义 Hook 可以使用 React 内置 Hooks，并参与 React 的状态与生命周期管理。

---

### Q2：自定义 Hook 会共享状态吗？

> 不会。每次调用 Hook 都是**独立状态**，除非借助外部 store / context。

---

### Q3：自定义 Hook 能替代 HOC 吗？

> **逻辑复用层面可以，能力更强；UI 增强场景仍可能用 HOC。**

---

### Q4：Hook 里能发请求吗？

> 可以，但要处理：

* 依赖变化
* 竞态取消
* 卸载清理

---

## 八、什么时候**不适合**用自定义 Hook？

* 涉及复杂 UI 结构
* 强 UI 定制（弹窗 / 表单布局）
* 逻辑不具备复用价值

---

如果你愿意，我可以继续帮你：

* 🧠 **“写一个让面试官追着问的高级 Hook”**
* 🔥 **Hook + Context 实现 mini 状态管理**
* 🧪 **Hook 的单元测试（react-hooks-testing-library）**
* 🧩 **从 HOC 重构成 Hook 的实战案例**

你更想往 **面试** 还是 **项目实战** 再深挖一层？

---
title: useEvent 用法
category: React
tags: [React]
description: useEvent 是 React 19 稳定的新 Hook，它主要解决一个老问题：事件回调函数的“闭包陷阱”和依赖数组问题。
date: 2026-02-11
---

`useEvent` 是 React 19 稳定的新 Hook，它主要解决一个老问题：

> 事件回调函数的“闭包陷阱”和依赖数组问题。

我们分 5 部分讲清楚：

---

# 一、useEvent 是干什么的？

一句话：

> 创建一个“引用稳定，但内部逻辑始终是最新 state”的事件函数。

它的特性：

* ✅ 返回的函数引用永远不变
* ✅ 内部访问的是最新 state
* ✅ 不需要依赖数组
* ✅ 不会触发重新渲染

---

# 二、为什么需要 useEvent？

先看经典问题 👇

```jsx
function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log(count);
  }

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={handleClick}>log</button>
    </>
  );
}
```

问题：

* 每次 render 都会创建新的 handleClick
* 如果把它传给子组件，会导致子组件重新渲染
* 如果在 useEffect 里使用它，会需要加依赖

---

## 更严重的问题（闭包陷阱）

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // 可能是旧值
  }, 1000);

  return () => clearInterval(id);
}, []);
```

因为闭包捕获了初始 count。

解决方式以前是：

```jsx
useRef + 手动同步
```

---

# 三、useEvent 基本用法

```jsx
import { useEvent } from "react";

function App() {
  const [count, setCount] = useState(0);

  const handleClick = useEvent(() => {
    console.log(count);
  });

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={handleClick}>log</button>
    </>
  );
}
```

特点：

* handleClick 引用永远不变
* 但内部的 count 永远是最新的

---

# 四、核心使用场景

---

## 场景 1️⃣ 传给子组件避免重复渲染

```jsx
const handleSubmit = useEvent(() => {
  sendData(formData);
});

return <Child onSubmit={handleSubmit} />;
```

相比 useCallback：

* 不需要依赖数组
* 不会因为 formData 改变导致函数变

---

## 场景 2️⃣ 定时器 / 事件监听

```jsx
const onTick = useEvent(() => {
  console.log(count);
});

useEffect(() => {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}, []);
```

不用：

* 加依赖
* 手写 ref
* 担心旧闭包

---

## 场景 3️⃣ DOM 原生事件

```jsx
const handleScroll = useEvent(() => {
  console.log(window.scrollY);
});

useEffect(() => {
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

---

# 五、和 useCallback 的区别

| 对比       | useCallback | useEvent |
| -------- | ----------- | -------- |
| 引用是否稳定   | 依赖数组决定      | 永远稳定     |
| 是否需要依赖数组 | 需要          | 不需要      |
| 是否可能闭包旧值 | 会           | 不会       |
| 是否触发重渲染  | 可能          | 不会       |
| 适用场景     | 记忆函数        | 事件回调     |

---

# 六、底层原理（简化理解）

useEvent 本质类似：

```js
function useEvent(fn) {
  const ref = useRef(fn);

  ref.current = fn;

  return useCallback((...args) => {
    return ref.current(...args);
  }, []);
}
```

真实实现更复杂（与 Fiber 绑定），但思想类似：

> 函数壳稳定，内部逻辑通过 ref 指向最新函数。

---

# 七、什么时候不要用 useEvent？

⚠️ 不要用于：

* 渲染逻辑
* 依赖变化计算
* 需要参与 React 数据流的函数

useEvent 只适合：

> 事件回调

它不会触发重新 render。

---

# 八、面试高分回答

如果被问：

> useEvent 是什么？解决什么问题？

你可以说：

> useEvent 返回一个引用稳定的函数，但内部逻辑始终读取最新 state。
> 它解决了闭包陷阱和 useCallback 依赖数组问题。
> 适用于事件回调场景，避免不必要的重新渲染。

---

# 九、架构级理解

以前：

```
useCallback = 优化渲染
```

现在：

```
useEvent = 优化事件系统
```

React 正在把：

* 渲染逻辑
* 副作用逻辑
* 事件逻辑

分离开。

---

如果你愿意，我可以继续深挖：

* 🔥 useEvent 和 Concurrent Mode 的关系
* 🔥 为什么 useEvent 不会触发 re-render
* 🔥 useEvent 是否可以替代 useCallback？
* 🔥 useEvent 在 React 19 调度中的位置

你想往哪个方向继续？

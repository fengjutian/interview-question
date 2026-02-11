---
title: Render Props 可以和 Hooks 一起使用
category: React
tags: [React, Render Props, Hooks]
description: Render Props 组件内部可以使用 Hooks，也可以在 Render Props 的函数里使用 Hooks（前提是它是一个组件）。但不能在普通回调函数里随便用 Hooks。
date: 2026-02-11
---

一句话结论：

> ✅ Render Props 组件内部可以使用 Hooks
> ✅ 使用 Render Props 的函数里也可以用 Hooks（前提是它是一个组件）
> ⚠️ 但不能在普通回调函数里随便用 Hooks

---

# 一、Render Props 回顾

典型写法：

```jsx
<DataProvider>
  {(data) => <div>{data}</div>}
</DataProvider>
```

Render Props 本质：

> 把一个函数当作 children 传进去，让组件决定什么时候调用。

---

# 二、情况一：Render Props 组件内部使用 Hooks ✅

完全没问题。

```jsx
function Mouse({ children }) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return children(position);
}
```

使用：

```jsx
<Mouse>
  {(pos) => <p>{pos.x}, {pos.y}</p>}
</Mouse>
```

✔ 合法
✔ 推荐
✔ 现代写法

---

# 三、情况二：在 Render Props 的函数里使用 Hook ⚠️

❌ 这样是错误的：

```jsx
<Mouse>
  {(pos) => {
    const [count, setCount] = useState(0); // ❌ 错
    return <div>{count}</div>;
  }}
</Mouse>
```

为什么？

因为：

> Hooks 只能在 **函数组件的顶层** 调用
> 不能在普通函数、条件、循环里调用

这里的 `(pos) => {}` 只是一个普通函数，不是 React 组件。

---

# 四、那怎么才能在 Render Props 里用 Hook？

把它写成组件。

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

<Mouse>
  {(pos) => (
    <>
      <div>{pos.x}</div>
      <Counter />
    </>
  )}
</Mouse>
```

✔ 这是合法的

---

# 五、为什么现在很少用 Render Props 了？

因为 Hooks 出现之后：

Render Props 主要解决：

* 逻辑复用
* 状态共享

Hooks 直接干掉它：

```jsx
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}
```

使用：

```jsx
function App() {
  const pos = useMouse();
  return <div>{pos.x}</div>;
}
```

更简洁
更直观
没有嵌套地狱

---

# 六、面试标准答案总结 🎯

如果面试官问：

> Render Props 可以在 Hook 里使用吗？

你可以这样回答：

1. Render Props 组件内部可以正常使用 Hooks
2. Render Props 的回调函数里不能直接使用 Hooks
3. 因为 Hooks 只能在函数组件顶层调用
4. 现代项目更推荐用自定义 Hook 替代 Render Props

---

# 七、终极理解（架构层面）

Render Props = 组件级逻辑复用
HOC = 组件级逻辑复用
Hooks = 函数级逻辑复用（更底层）

Hooks 是对 Render Props / HOC 的“降维打击”。

---

如果你愿意，我可以给你：

* 🔥 Render Props vs HOC vs Hooks 面试对比表
* 🔥 手写一个 useX 替代 Render Props 的完整案例
* 🔥 面试官会追问的 5 个陷阱问题

你想往“面试深挖”还是“源码原理”方向走？

---
title: 为什么 Hooks 必须按顺序调用（底层机制）
category: React
tags: [React, Hooks]
description: Hooks 必须按顺序调用，是因为 React 在内部是通过“调用顺序”来定位每个 Hook 的状态的。
date: 2026-02-11
---


# 一句话答案

> Hooks 必须按顺序调用，是因为 React 在内部是通过“调用顺序”来定位每个 Hook 的状态的。

React **不会通过变量名存 Hook**，而是靠顺序。

---

# 一、React 内部怎么存 Hook？

每个函数组件在 Fiber 上都会挂一个：

```
fiber.memoizedState
```

它其实是一个 **单向链表**。

结构大概这样：

```
Fiber
  ↓
memoizedState → Hook1 → Hook2 → Hook3 → null
```

每个 Hook 节点长这样：

```js
{
  memoizedState: 当前状态值,
  baseState: 上次状态,
  queue: 更新队列,
  next: 下一个 Hook
}
```

---

# 二、React 怎么知道你在用第几个 Hook？

关键点来了：

在函数组件执行时，React 内部维护一个指针：

```js
let workInProgressHook = null;
```

当你调用：

```js
useState()
useEffect()
useState()
```

React 实际做的是：

```
第1次调用 → 取链表第1个 Hook
第2次调用 → 取链表第2个 Hook
第3次调用 → 取链表第3个 Hook
```

它不看变量名，只靠“第几次调用”。

---

# 三、如果顺序变了会发生什么？

来看错误示例：

```jsx
function Demo() {
  const [a, setA] = useState(0);

  if (a > 0) {
    useEffect(() => {});
  }

  const [b, setB] = useState(1);
}
```

第一次 render（a=0）：

```
Hook1 → useState(a)
Hook2 → useState(b)
```

第二次 render（a=1）：

```
Hook1 → useState(a)
Hook2 → useEffect ❌
Hook3 → useState(b) ❌
```

问题来了：

React 以为：

* 第二个 Hook 是 b
* 但你现在变成 useEffect

结果：

> Hook 状态错位

这就是为什么会报：

```
Rendered fewer hooks than expected
```

---

# 四、为什么 React 不用 key 或 name 记录 Hook？

因为 Hooks 设计目标是：

* 轻量
* 快
* 不增加额外开销

如果用 key：

```js
useState("count")
```

那就需要：

* Map 查找
* 字符串比较
* 额外内存

现在这种顺序机制是：

> O(1) 访问，纯指针移动

极致性能。

---

# 五、源码级流程（简化版）

组件 render 时：

```js
function renderWithHooks() {
  currentlyRenderingFiber = fiber;
  workInProgressHook = null;

  Component(); // 执行函数组件
}
```

每次调用 Hook：

```js
function useState() {
  const hook = updateWorkInProgressHook();
}
```

updateWorkInProgressHook 做的事：

1. 如果是首次渲染 → 创建 Hook 节点
2. 如果是更新 → 取当前链表的下一个 Hook
3. 指针后移

所以：

> Hook 的位置 = 它在函数里的调用顺序

---

# 六、这就是为什么：

### ❌ 不能写在条件里

### ❌ 不能写在循环里

### ❌ 不能写在普通函数里

### ❌ 不能提前 return

因为都会破坏调用顺序。

---

# 七、这也是为什么：

> Hooks 只能在函数组件顶层调用

不是语法限制。

是因为底层实现就是顺序链表。

---

# 八、面试高分回答版本

你可以这样说：

> React 在 Fiber 上以链表形式存储 Hooks，调用时通过一个指针按顺序取出对应 Hook。
> 它并不会通过变量名或 key 标识 Hook，而是完全依赖调用顺序。
> 如果 Hook 顺序发生变化，就会导致状态错位，因此必须保证每次 render 时 Hook 调用顺序一致。

这回答是 90 分。

---

# 九、终极理解（架构视角）

Hooks 的本质：

> 把组件的状态机，按调用顺序拆成一个链表。

函数组件其实被 React 改造成：

```
状态机执行器
```

---

# 十、进阶追问（面试官可能会问）

1. useEffect 为什么在 commit 阶段执行？
2. 多个 useState 是如何区分的？
3. useRef 为什么不会触发更新？
4. Hooks 为什么不能在 class 组件里用？
5. Concurrent Mode 下 Hooks 怎么保持一致？

---

如果你愿意，我可以：

* 🔥 手写一个 50 行 mini Hooks 实现
* 🔥 画出 Fiber + Hooks 运行流程图
* 🔥 深挖 useEffect 底层执行时机
* 🔥 讲讲 React 19 Hooks 的内部变化

你想往哪个深度继续？

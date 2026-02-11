---
title: 深挖 useEffect 底层执行时机
category: React
tags: [React, useEffect]
description: useEffect 在 commit 阶段执行，而且是浏览器完成 DOM 渲染之后异步执行。
date: 2026-02-11
---

---

# 一句话总结

> useEffect 在 commit 阶段执行，而且是浏览器完成 DOM 渲染之后异步执行。

关键词：

* render 阶段：纯计算
* commit 阶段：操作 DOM
* effect 阶段：副作用执行

---

# 一、React 整体执行流程

一次更新大致流程：

```
调度更新
   ↓
render 阶段（可中断）
   ↓
commit 阶段（不可中断）
   ↓
执行 effects
```

重点：

* render 可以被打断（Concurrent Mode）
* commit 不可以被打断
* useEffect 在 commit 之后执行

---

# 二、render 阶段发生了什么？

render 阶段做的事情：

1. 执行函数组件
2. 构建 Fiber 树
3. 收集 effect

注意：

> useEffect 在 render 阶段不会执行，只是被“收集”

源码中会创建 effect 对象，挂到 Fiber 上。

大概结构：

```js
fiber.updateQueue = {
  lastEffect: effect
}
```

每个 effect 结构：

```js
{
  tag,        // Passive / Layout
  create,     // 你的 effect 回调
  destroy,    // 清理函数
  deps,
  next
}
```

---

# 三、commit 阶段做了什么？

commit 分三步：

```
1️⃣ before mutation
2️⃣ mutation（DOM 操作）
3️⃣ layout
```

执行顺序：

```
commitBeforeMutationEffects
commitMutationEffects
commitLayoutEffects
```

其中：

* useLayoutEffect 在 layout 阶段同步执行
* useEffect 在 commit 完成后单独调度执行

---

# 四、useEffect 为什么是异步的？

关键源码逻辑：

```js
scheduleCallback(NormalPriority, flushPassiveEffects)
```

React 会把 useEffect 放进一个单独的任务队列。

等浏览器完成：

* DOM 更新
* layout
* paint

之后再执行：

```js
flushPassiveEffects()
```

所以 useEffect 是：

> 宏任务级别的延后执行

这也是为什么：

```js
useEffect(() => {
  console.log("effect");
});

console.log("render");
```

输出顺序：

```
render
effect
```

---

# 五、useLayoutEffect 为什么同步？

useLayoutEffect 在：

```
commitLayoutEffects
```

阶段执行。

执行时机：

```
DOM 更新完
浏览器还没 paint
```

所以它可以：

* 读取 DOM
* 同步修改样式
* 不会闪烁

---

# 六、完整时间线图

假设 setState 触发更新：

```
1. render 阶段
   - 执行组件
   - 收集 effect

2. commit 阶段
   - 修改 DOM
   - 执行 layout effects

3. 浏览器 paint

4. 执行 passive effects（useEffect）
```

---

# 七、为什么要设计成这样？

如果 useEffect 同步执行会发生什么？

问题：

* 阻塞渲染
* 降低性能
* 打断浏览器帧率

React 设计目标：

> 保证 UI 优先渲染，再执行副作用

这是性能优化。

---

# 八、清理函数什么时候执行？

清理函数执行时机：

### 情况1：依赖变了

顺序：

```
旧 destroy()
新 create()
```

### 情况2：组件卸载

在 commit 阶段执行 destroy。

---

# 九、Concurrent Mode 下的变化

在并发模式：

* render 可能执行多次
* 但 effect 只会在 commit 后执行一次

React 保证：

> 只有最终提交的 Fiber 会执行 effect

这避免了副作用乱执行。

---

# 十、面试高分回答版本

可以这样说：

> useEffect 在 render 阶段只是被收集，不会执行。
> 在 commit 阶段 DOM 更新完成后，React 会调度一个异步任务执行 passive effects。
> 因此 useEffect 总是在浏览器完成绘制之后执行，不会阻塞渲染。
> 相比之下，useLayoutEffect 在 commit 阶段同步执行，在浏览器 paint 之前完成。

这回答是 95 分。

---

# 十一、进阶追问（很多人答不出来）

### 1️⃣ 为什么 useEffect 在严格模式下会执行两次？

因为 React 18 会模拟 mount → unmount → mount。

目的是：

> 检测副作用是否安全

---

### 2️⃣ 为什么 useEffect 不能 async？

因为：

```js
useEffect(async () => {})
```

会返回 Promise，而 React 期待返回的是 cleanup 函数。

---

### 3️⃣ 为什么 effect 有 tag？

因为 React 要区分：

* Passive
* Layout
* Insertion（React 18 新增）

---

# 十二、终极理解

React 的更新本质是：

> 构建一棵“可提交”的状态树
> 然后在 commit 阶段一次性提交
> 副作用延后执行

useEffect 就是：

> 提交后的副作用队列

---

如果你愿意，我可以继续深挖：

* 🔥 useEffect 依赖数组是怎么比较的？
* 🔥 为什么会产生闭包陷阱？
* 🔥 flushSync 会不会影响 effect？
* 🔥 手写一个 mini useEffect
* 🔥 React 19 effect 的优化变化

你想往哪个方向再深入？

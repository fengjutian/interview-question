---
title: JavaScript 中的微任务与宏任务
category: JavaScript
tags: [JavaScript, 微任务, 宏任务]
description: 详细解释了 JavaScript 中的微任务与宏任务，包括它们的执行顺序、应用场景和使用方法
date: 2026-02-05
---

## 一、先一句话给你一个“脑内模型”

> **JS 执行顺序 = 同步 → 微任务 → 渲染 → 宏任务**

记住这句话，后面所有题都能推出来。

---

## 二、为什么要区分「宏任务 / 微任务」？

JS 是**单线程**的，但浏览器/Node 要同时处理：

* 用户点击
* 网络请求
* 定时器
* Promise

👉 所以设计了一个 **事件循环（Event Loop）**：

* **宏任务**：大任务，阶段性执行
* **微任务**：当前任务执行完立刻清空

**微任务的设计目的只有一个**：

> **让“状态变更”能尽快生效**

---

## 三、宏任务（Macro Task）

### 常见宏任务

* `script`（整体代码）
* `setTimeout`
* `setInterval`
* `setImmediate`（Node）
* `MessageChannel`
* I/O
* UI 事件（click、scroll）

**特点**

* 一次事件循环只执行 **一个宏任务**
* 执行完后 → 执行所有微任务

---

## 四、微任务（Micro Task）

### 常见微任务

* `Promise.then / catch / finally`
* `queueMicrotask`
* `MutationObserver`
* `process.nextTick`（Node，特殊）

**特点**

* 当前执行栈清空后 **立刻执行**
* 会一直执行，直到微任务队列为空
* **会阻塞页面渲染**

---

## 五、事件循环完整流程（浏览器）

```text
1. 执行一个宏任务（script / setTimeout）
2. 清空微任务队列
3. 进行页面渲染（可能）
4. 进入下一个宏任务
```

⚠️ **关键点**

* 每个宏任务后，都会把微任务“清空”
* 渲染发生在宏任务之间，而不是微任务之间

---

## 六、经典执行顺序例子（必会）

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

Promise.resolve().then(() => {
  console.log(3);
});

console.log(4);
```

### 执行过程

1. 同步代码
   👉 `1`、`4`
2. 微任务
   👉 `3`
3. 宏任务
   👉 `2`

### 输出顺序

```text
1
4
3
2
```

---

## 七、微任务“套娃”示例（面试官最爱）

```js
Promise.resolve().then(() => {
  console.log(1);
  Promise.resolve().then(() => {
    console.log(2);
  });
});
```

**输出**

```text
1
2
```

👉 原因：**微任务里产生的微任务，会追加到当前微任务队列末尾**

---

## 八、和渲染相关的坑（高频）

```js
setTimeout(() => {
  console.log('timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise');
  while (true) {} // 死循环
});
```

结果：

* 页面 **永远不会渲染**
* `setTimeout` **永远不执行**

👉 **微任务如果不结束，宏任务永远进不来**

---

## 九、Node.js 中的差异（加分点）

### Node 里的队列优先级（简化版）

```text
process.nextTick
↓
Promise 微任务
↓
timers (setTimeout)
↓
poll (I/O)
↓
check (setImmediate)
```

⚠️ `process.nextTick`

* 比 Promise 还快
* **可能饿死 I/O（不推荐滥用）**

---

## 十、一句话对比总结（面试直接用）

| 对比项    | 宏任务        | 微任务          |
| ------ | ---------- | ------------ |
| 执行时机   | 事件循环阶段     | 当前宏任务结束后     |
| 队列数量   | 每轮一个       | 全部清空         |
| 是否阻塞渲染 | 否          | 是            |
| 常见 API | setTimeout | Promise.then |

---

## 十一、知识图谱视角

```text
事件循环
├─ 宏任务队列
│  ├─ setTimeout
│  └─ UI 事件
│
├─ 微任务队列
│  ├─ Promise
│  ├─ queueMicrotask
│
└─ 浏览器渲染
```


